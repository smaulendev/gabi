import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryMovement } from './entities/inventory.entity';
import { Lot } from '../lots/entities/lot.entity';
import { Product } from '../products/entities/product.entity';

import { AlertsModule } from '../alerts/alerts.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryMovement, Lot, Product]),
    AlertsModule,
    AuditModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}