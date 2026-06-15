import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SensorReadingsService } from './sensor-readings.service';
import { SensorReadingsController } from './sensor-readings.controller';
import { SensorReading } from './entities/sensor-reading.entity';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SensorReading]),
    AlertsModule,
  ],
  controllers: [SensorReadingsController],
  providers: [SensorReadingsService],
})
export class SensorReadingsModule {}