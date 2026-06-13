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

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private readonly lotsRepository: Repository<Lot>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

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

    return this.lotsRepository.save(lot);
  }

  findAll() {
    return this.lotsRepository.find({
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