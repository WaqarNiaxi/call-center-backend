// src/sale-payments/dto/request-sale-payment.dto.ts
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class RequestSalePaymentDto {
  @IsMongoId()
  saleId: string;
  

  // Optional note from requester
  @IsOptional()
  @IsString()
  note?: string;
}
