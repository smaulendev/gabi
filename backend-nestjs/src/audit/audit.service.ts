import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

import { AuditLog } from './entities/audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async createLog(action: string, entity: string, details: string) {
    const rawData = `${action}|${entity}|${details}|${new Date().toISOString()}`;

    const hash = createHash('sha256')
      .update(rawData)
      .digest('hex');

    const log = this.auditRepository.create({
      action,
      entity,
      details,
      hash,
    });

    return this.auditRepository.save(log);
  }

  findAll() {
    return this.auditRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}