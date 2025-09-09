import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';

export class CreateSaleDto {
  @IsMongoId()
  @IsNotEmpty()
  submittedBy: string;

  @IsMongoId()
  @IsNotEmpty()
  merchant: string;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  cvv: string;

  @IsString()
  @IsNotEmpty()
  billingAddress: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(['pending', 'approved', 'declined', 'refunded'])
  @IsOptional()
  status?: 'pending' | 'approved' | 'declined' | 'refunded';

  @IsString()
  @IsOptional()
  feedbackNote?: string;

  @IsDateString()
  @IsOptional()
  processedAt?: string;

  @IsDateString()
  @IsOptional()
  availableAt?: string;
}
