import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { Lot } from './entities/lot.entity';
import { Product } from '../products/entities/product.entity';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, Product]),
    AlertsModule,
  ],
  controllers: [LotsController],
  providers: [LotsService],
})
export class LotsModule {}