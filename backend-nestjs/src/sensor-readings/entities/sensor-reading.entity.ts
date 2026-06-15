import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('sensor_readings')
export class SensorReading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  temperature: number;

  @Column({ type: 'float' })
  humidity: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}