import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DispatchInventoryDto } from './dto/dispatch-inventory.dto';
import { InventoryMovement } from './entities/inventory.entity';
import { Lot } from '../lots/entities/lot.entity';
import { AlertsService } from '../alerts/alerts.service';
import { Product } from '../products/entities/product.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementsRepository: Repository<InventoryMovement>,

    @InjectRepository(Lot)
    private readonly lotsRepository: Repository<Lot>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly alertsService: AlertsService,

    private readonly auditService: AuditService,
  ) {}

  async dispatch(dispatchDto: DispatchInventoryDto) {
    const lots = await this.lotsRepository.find({
      where: {
        product: {
          id: dispatchDto.productId,
        },
      },
      order: {
        expirationDate: 'ASC',
      },
    });

    const totalAvailable = lots.reduce(
      (sum, lot) => sum + lot.currentQuantity,
      0,
    );

    if (totalAvailable < dispatchDto.quantity) {
      throw new BadRequestException(
        'Stock insuficiente para realizar el despacho',
      );
    }

    let remainingQuantity = dispatchDto.quantity;
    const movements: InventoryMovement[] = [];

    for (const lot of lots) {
      if (remainingQuantity <= 0) break;
      if (lot.currentQuantity <= 0) continue;

      const quantityToDispatch = Math.min(
        lot.currentQuantity,
        remainingQuantity,
      );

      lot.currentQuantity -= quantityToDispatch;
      remainingQuantity -= quantityToDispatch;

      await this.lotsRepository.save(lot);

      const movement = this.movementsRepository.create({
        productId: dispatchDto.productId,
        lotId: lot.id,
        quantity: quantityToDispatch,
        type: 'DISPATCH',
        detail: `Despacho FEFO desde lote ${lot.batchNumber}`,
      });

      movements.push(await this.movementsRepository.save(movement));

      await this.auditService.createLog(
        'DISPATCH',
        'LOT',
        `Despacho FEFO desde lote ${lot.batchNumber} por ${quantityToDispatch} unidades`,
      );
      if (lot.currentQuantity === 0) {
        await this.alertsService.create({
          type: 'LOTE_AGOTADO',
          severity: 'MEDIUM',
          message: `El lote ${lot.batchNumber} quedó sin stock después del despacho FEFO`,
        });
      }

      await this.auditService.createLog(
        'LOT_EMPTY',
        'LOT',
        `Lote ${lot.batchNumber} agotado después de despacho FEFO`,
      );
    }

    const product = await this.productsRepository.findOne({
      where: {
        id: dispatchDto.productId,
      },
    });

    const updatedLots = await this.lotsRepository.find({
      where: {
        product: {
          id: dispatchDto.productId,
        },
      },
    });

    const totalStock = updatedLots.reduce(
      (sum, lot) => sum + lot.currentQuantity,
      0,
    );

    if (product && totalStock <= product.minStock) {
      const activeAlerts = await this.alertsService.findActive();

      const alreadyExists = activeAlerts.some(
        (alert) =>
          alert.type === 'QUIEBRE_STOCK' &&
          alert.message.includes(product.name),
      );

      await this.auditService.createLog(
        'STOCK_BREAK_RISK',
        'PRODUCT',
        `Producto ${product.name} con stock ${totalStock} bajo mínimo ${product.minStock}`,
      );

      if (!alreadyExists) {
        await this.alertsService.create({
          type: 'QUIEBRE_STOCK',
          severity: 'HIGH',
          message: `El producto ${product.name} presenta riesgo de quiebre de stock. Stock actual: ${totalStock}, mínimo definido: ${product.minStock}`,
        });
      }
    }

    await this.checkExpirationAlerts(dispatchDto.productId);

    return {
      message: 'Despacho realizado correctamente aplicando FEFO',
      requestedQuantity: dispatchDto.quantity,
      remainingStock: totalStock,
      movements,
    };
  }

  private async checkExpirationAlerts(productId: number) {
    const lots = await this.lotsRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
    });

    const today = new Date();

    for (const lot of lots) {
      if (lot.currentQuantity <= 0) continue;

      const expirationDate = new Date(lot.expirationDate);

      const diffTime = expirationDate.getTime() - today.getTime();
      const daysToExpire = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysToExpire <= 30 && daysToExpire >= 0) {
        const activeAlerts = await this.alertsService.findActive();

        const alreadyExists = activeAlerts.some(
          (alert) =>
            alert.type === 'LOTE_PROXIMO_VENCER' &&
            alert.message.includes(lot.batchNumber),
        );

        if (!alreadyExists) {
          await this.alertsService.create({
            type: 'LOTE_PROXIMO_VENCER',
            severity: daysToExpire <= 7 ? 'HIGH' : 'MEDIUM',
            message: `El lote ${lot.batchNumber} del producto ${lot.product.name} vence en ${daysToExpire} días.`,
          });
        }
      }
    }
  }

  findAll() {
    return this.movementsRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
