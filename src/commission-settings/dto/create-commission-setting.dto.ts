import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsMongoId, Min, Max } from 'class-validator';

export class CreateCommissionSettingDto {
  @ApiProperty({
    example: '64b9a77c69744d8535de459c8',
    description: 'User ID of the center admin this setting belongs to',
  })
  @IsMongoId()
  centerId: string; // userId of CENTER_ADMIN

  @ApiProperty({ example: 20, description: 'Commission percentage (system keeps this %)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPercentage: number;

  @ApiProperty({ example: 15, description: 'Chargeback / dispute fee in USD' })
  @IsNumber()
  @IsPositive()
  chargebackFee: number;

  @ApiProperty({ example: 7, description: 'Clearing time in days before funds can be withdrawn' })
  @IsNumber()
  @IsPositive()
  clearingDays: number;
}
