import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({ example: 'Stripe_US', description: 'Merchant name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
