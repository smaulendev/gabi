import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productsRepository.findOne({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new BadRequestException('Ya existe un producto con este SKU');
    }

    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return this.productsRepository.findOne({
      where: { id },
    });
  }

  async findByBarcode(barcode: string) {
  return this.productsRepository.findOne({
    where: { barcode },
  });
}
}