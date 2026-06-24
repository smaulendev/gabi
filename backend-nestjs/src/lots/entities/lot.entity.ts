import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';

@Entity('lots')
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  batchNumber: string;

  @Column()
  expirationDate: Date;

  @Column()
  quantity: number;

  @Column()
  currentQuantity: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(
    () => Product,
    (product) => product.lots,
    {
      eager: true,
    },
  )
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}