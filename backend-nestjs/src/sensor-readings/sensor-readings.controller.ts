import { Body, Controller, Get, Post } from '@nestjs/common';

import { SensorReadingsService } from './sensor-readings.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';

@Controller('sensor-readings')
export class SensorReadingsController {
  constructor(private readonly sensorReadingsService: SensorReadingsService) {}

  @Post()
  create(@Body() createSensorReadingDto: CreateSensorReadingDto) {
    return this.sensorReadingsService.create(createSensorReadingDto);
  }

  @Get()
  findAll() {
    return this.sensorReadingsService.findAll();
  }

  @Get('latest')
  findLatest() {
    return this.sensorReadingsService.findLatest();
  }
}