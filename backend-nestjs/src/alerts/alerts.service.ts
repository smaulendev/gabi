import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAlertDto } from './dto/create-alert.dto';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertsRepository: Repository<Alert>,
  ) {}

  create(createAlertDto: CreateAlertDto) {
    const alert = this.alertsRepository.create(createAlertDto);
    return this.alertsRepository.save(alert);
  }

  findAll() {
    return this.alertsRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findActive() {
    return this.alertsRepository.find({
      where: {
        isResolved: false,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async resolve(id: number) {
    const alert = await this.alertsRepository.findOne({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }

    alert.isResolved = true;

    return this.alertsRepository.save(alert);
  }
}