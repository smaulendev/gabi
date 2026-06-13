import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { LotsService } from './lots.service';
import { CreateLotDto } from './dto/create-lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Post()
  create(@Body() createLotDto: CreateLotDto) {
    return this.lotsService.create(createLotDto);
  }

  @Get()
  findAll() {
    return this.lotsService.findAll();
  }

  @Get('product/:productId/fefo')
  findByProductFefo(@Param('productId') productId: string) {
    return this.lotsService.findByProductFefo(+productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotsService.findOne(+id);
  }
}