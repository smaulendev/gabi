import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateLotDto } from './dto/create-lot.dto';
import { Lot } from './entities/lot.entity';
import { Product } from '../products/entities/product.entity';
import { AlertsService } from '../alerts/alerts.service';
import { UpdateLotDto } from './dto/update-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private readonly lotsRepository: Repository<Lot>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly alertsService: AlertsService,
  ) {}

  private readonly incompatibilities: Record<string, string[]> = {
    ACIDO: ['BASE'],
    BASE: ['ACIDO'],
    OXIDANTE: ['INFLAMABLE'],
    INFLAMABLE: ['OXIDANTE'],
  };

  private async checkChemicalCompatibility(product: Product) {
    if (!product.chemicalFamily) return;

    const incompatibleFamilies =
      this.incompatibilities[product.chemicalFamily] || [];

    if (incompatibleFamilies.length === 0) return;

    const activeLots = await this.lotsRepository.find({
      relations: {
        product: true,
      },
    });

    const incompatibleLot = activeLots.find((lot) => {
      if (lot.currentQuantity <= 0) return false;
      if (!lot.product?.chemicalFamily) return false;
      if (lot.product.id === product.id) return false;

      return incompatibleFamilies.includes(lot.product.chemicalFamily);
    });

    if (!incompatibleLot) return;

    const activeAlerts = await this.alertsService.findActive();

    const alreadyExists = activeAlerts.some(
      (alert) =>
        alert.type === 'COMPATIBILIDAD_QUIMICA' &&
        alert.message.includes(product.name) &&
        alert.message.includes(incompatibleLot.product.name),
    );

    if (alreadyExists) return;

    await this.alertsService.create({
      type: 'COMPATIBILIDAD_QUIMICA',
      severity: 'HIGH',
      message: `Compatibilidad química detectada: ${product.name} (${product.chemicalFamily}) no debería almacenarse junto a ${incompatibleLot.product.name} (${incompatibleLot.product.chemicalFamily}).`,
    });
  }

  async create(createLotDto: CreateLotDto) {

    const product = await this.productsRepository.findOne({
      where: { id: createLotDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const existingLot = await this.lotsRepository.findOne({
      where: { batchNumber: createLotDto.batchNumber },
    });

    if (existingLot) {
      throw new BadRequestException('Ya existe un lote con este número');
    }

    const lot = this.lotsRepository.create({
      batchNumber: createLotDto.batchNumber,
      expirationDate: createLotDto.expirationDate,
      quantity: createLotDto.quantity,
      currentQuantity: createLotDto.currentQuantity,
      product,
    });

    const savedLot = await this.lotsRepository.save(lot);


    await this.checkChemicalCompatibility(product);

    return savedLot;
  }

  async update(
  id: number,
  updateLotDto: UpdateLotDto,
) {
  const lot = await this.findOne(id);

  if (!lot) {
    throw new NotFoundException(
      'Lote no encontrado',
    );
  }

  await this.lotsRepository.update(
    id,
    updateLotDto,
  );

  return this.findOne(id);
}

async remove(id: number) {
  const lot = await this.findOne(id);

  if (!lot) {
    throw new NotFoundException(
      'Lote no encontrado',
    );
  }

  lot.isActive = false;

  await this.lotsRepository.save(lot);

  return {
    message: 'Lote desactivado correctamente',
  };
}

findAll() {
  return this.lotsRepository.find({
    where: {
      isActive: true,
    },
    order: {
      expirationDate: 'ASC',
    },
  });
}
  findOne(id: number) {
    return this.lotsRepository.findOne({
      where: { id },
    });
  }

  findByProductFefo(productId: number) {
    return this.lotsRepository.find({
      where: {
        product: {
          id: productId,
        },
      },
      order: {
        expirationDate: 'ASC',
      },
    });
  }
}
