import { Body, Controller, Get, Post } from '@nestjs/common';

import { InventoryService } from './inventory.service';
import { DispatchInventoryDto } from './dto/dispatch-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('dispatch')
  dispatch(@Body() dispatchDto: DispatchInventoryDto) {
    return this.inventoryService.dispatch(dispatchDto);
  }

  @Get('movements')
  findAll() {
    return this.inventoryService.findAll();
  }
}