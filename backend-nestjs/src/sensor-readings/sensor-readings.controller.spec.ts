import { Test, TestingModule } from '@nestjs/testing';
import { SensorReadingsController } from './sensor-readings.controller';
import { SensorReadingsService } from './sensor-readings.service';

describe('SensorReadingsController', () => {
  let controller: SensorReadingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorReadingsController],
      providers: [SensorReadingsService],
    }).compile();

    controller = module.get<SensorReadingsController>(SensorReadingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
