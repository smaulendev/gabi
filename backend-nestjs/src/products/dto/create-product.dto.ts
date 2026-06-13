export class CreateProductDto {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  requiresColdChain?: boolean;
  minTemperature?: number;
  maxTemperature?: number;
}