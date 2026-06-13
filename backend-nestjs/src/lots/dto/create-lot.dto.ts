export class CreateLotDto {
  batchNumber: string;
  expirationDate: Date;
  quantity: number;
  currentQuantity: number;
  productId: number;
}