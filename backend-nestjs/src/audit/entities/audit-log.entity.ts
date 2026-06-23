import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column({ type: 'text' })
  details: string;

  @Column()
  hash: string;

  @CreateDateColumn()
  createdAt: Date;
}