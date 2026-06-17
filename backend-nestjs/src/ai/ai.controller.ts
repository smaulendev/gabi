import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('risk-summary')
  riskSummary() {
    return this.aiService.analyzeRisk();
  }
}