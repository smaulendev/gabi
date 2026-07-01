export class CreateProductDto {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category?: string;
  minStock?: number;
  requiresColdChain?: boolean;
  minTemperature?: number;
  maxTemperature?: number;
  chemicalFamily?: string;
}