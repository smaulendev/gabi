import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

import { NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';

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
    where: {
      isActive: true,
    },
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

async update(
  id: number,
  updateProductDto: UpdateProductDto,
) {
  const product = await this.findOne(id);

  if (!product) {
    throw new NotFoundException(
      'Producto no encontrado',
    );
  }

  await this.productsRepository.update(
    id,
    updateProductDto,
  );

  return this.findOne(id);
}

async remove(id: number) {
  const product = await this.findOne(id);

  if (!product) {
    throw new NotFoundException('Producto no encontrado');
  }

  product.isActive = false;

  await this.productsRepository.save(product);

  return {
    message: 'Producto desactivado correctamente',
  };
}

}