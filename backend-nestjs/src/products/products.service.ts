import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly auditService: AuditService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.productsRepository.findOne({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new BadRequestException('Ya existe un producto con este SKU');
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      isActive: true,
    });

    const savedProduct = await this.productsRepository.save(product);

    await this.auditService.createLog(
      'PRODUCT_CREATE',
      'PRODUCT',
      `Producto ${savedProduct.name} creado con SKU ${savedProduct.sku}`,
      savedProduct.sku,
      'SYSTEM',
    );

    return savedProduct;
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

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    await this.productsRepository.update(id, updateProductDto);

    const updatedProduct = await this.findOne(id);

    if (!updatedProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    await this.auditService.createLog(
      'PRODUCT_UPDATE',
      'PRODUCT',
      `Producto ${updatedProduct.name} actualizado. SKU ${updatedProduct.sku}`,
      updatedProduct.sku,
      'SYSTEM',
    );

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.findOne(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    product.isActive = false;

    const disabledProduct = await this.productsRepository.save(product);

    await this.auditService.createLog(
      'PRODUCT_DISABLE',
      'PRODUCT',
      `Producto ${disabledProduct.name} desactivado. SKU ${disabledProduct.sku}`,
      disabledProduct.sku,
      'SYSTEM',
    );

    return {
      message: 'Producto desactivado correctamente',
    };
  }
}