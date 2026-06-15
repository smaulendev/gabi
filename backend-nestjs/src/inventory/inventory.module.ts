import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryMovement } from './entities/inventory.entity';
import { Lot } from '../lots/entities/lot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryMovement,
      Lot,
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}