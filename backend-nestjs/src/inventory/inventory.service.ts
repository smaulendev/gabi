import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DispatchInventoryDto } from './dto/dispatch-inventory.dto';
import { InventoryMovement } from './entities/inventory.entity';
import { Lot } from '../lots/entities/lot.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly movementsRepository: Repository<InventoryMovement>,

    @InjectRepository(Lot)
    private readonly lotsRepository: Repository<Lot>,
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

    let remainingQuantity = dispatchDto.quantity;
    const movements: InventoryMovement[] = [];

    const totalAvailable = lots.reduce(
      (sum, lot) => sum + lot.currentQuantity,
      0,
    );

    if (totalAvailable < dispatchDto.quantity) {
      throw new BadRequestException(
        'Stock insuficiente para realizar el despacho',
      );
    }

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
    }

    return {
      message: 'Despacho realizado correctamente aplicando FEFO',
      requestedQuantity: dispatchDto.quantity,
      movements,
    };
  }

  findAll() {
    return this.movementsRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}