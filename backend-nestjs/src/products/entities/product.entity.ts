import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  requiresColdChain: boolean;

  @Column({ type: 'float', nullable: true })
  minTemperature: number;

  @Column({ type: 'float', nullable: true })
  maxTemperature: number;

  @CreateDateColumn()
  createdAt: Date;
}