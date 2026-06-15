export class Inventory {}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('inventory_movements')
export class InventoryMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  lotId: number;

  @Column()
  quantity: number;

  @Column()
  type: string;

  @Column({ nullable: true })
  detail: string;

  @CreateDateColumn()
  createdAt: Date;
}