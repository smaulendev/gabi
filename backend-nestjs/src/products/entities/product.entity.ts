import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Lot } from '../../lots/entities/lot.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column({ unique: true, nullable: true })
  barcode: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  chemicalFamily: string;

  @Column({ default: 10 })
  minStock: number;

  @Column({ default: true })
isActive: boolean;

  @Column({ default: false })
  requiresColdChain: boolean;

  @Column({ type: 'float', nullable: true })
  minTemperature: number;

  @Column({ type: 'float', nullable: true })
  maxTemperature: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Lot, (lot) => lot.product)
  lots: Lot[];
}
