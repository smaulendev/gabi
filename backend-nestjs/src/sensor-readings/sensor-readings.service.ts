import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { SensorReading } from './entities/sensor-reading.entity';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class SensorReadingsService {
  constructor(
    @InjectRepository(SensorReading)
    private readonly sensorReadingsRepository: Repository<SensorReading>,

    private readonly alertsService: AlertsService,
  ) {}

  async create(createSensorReadingDto: CreateSensorReadingDto) {
    let status = 'NORMAL';

    if (
      createSensorReadingDto.temperature > 8 ||
      createSensorReadingDto.temperature < 2 ||
      createSensorReadingDto.humidity > 70
    ) {
      status = 'CRITICAL';
    }

    const reading = this.sensorReadingsRepository.create({
      ...createSensorReadingDto,
      status,
    });

    const savedReading = await this.sensorReadingsRepository.save(reading);

    if (status === 'CRITICAL') {
      await this.alertsService.create({
        type: 'CONDICION_AMBIENTAL',
        severity: 'HIGH',
        message: `Condición ambiental crítica detectada. Temperatura: ${createSensorReadingDto.temperature}°C, Humedad: ${createSensorReadingDto.humidity}%`,
      });
    }

    return savedReading;
  }

  findAll() {
    return this.sensorReadingsRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findLatest() {
    return this.sensorReadingsRepository.find({
      order: {
        id: 'DESC',
      },
      take: 5,
    });
  }
}