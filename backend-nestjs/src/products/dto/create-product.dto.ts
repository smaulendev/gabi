export class CreateProductDto {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category?: string;
  requiresColdChain?: boolean;
  minTemperature?: number;
  maxTemperature?: number;
}