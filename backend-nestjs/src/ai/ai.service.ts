import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  constructor(private readonly httpService: HttpService) {}

  private readonly aiUrl = process.env.AI_API_URL || 'http://localhost:8000';

  async analyzeRisk() {
    const payload = {
      expirationDays: 15,
      temperature: 12,
      humidity: 78,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.aiUrl}/risk`, payload),
    );

    return {
      message: 'Análisis de riesgo obtenido desde FastAPI',
      dataSent: payload,
      aiResponse: response.data,
    };
  }

  async analyzeSensorRisk(
    expirationDays: number,
    temperature: number,
    humidity: number,
  ) {
    const payload = {
      expirationDays,
      temperature,
      humidity,
    };

    const response = await firstValueFrom(
      this.httpService.post(`${this.aiUrl}/risk`, payload),
    );

    return response.data;
  }
}