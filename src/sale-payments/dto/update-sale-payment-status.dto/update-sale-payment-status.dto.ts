// src/sale-payments/dto/update-sale-payment-status.dto.ts
import { IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateSalePaymentStatusDto {
  @IsMongoId()
  id: string; // sale payment id

  @IsIn(['approved', 'paid', 'declined', 'canceled','draft'])
  status: 'approved' | 'paid' | 'declined' | 'canceled' | 'draft';

  @IsOptional()
  @IsString()
  payoutReference?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
