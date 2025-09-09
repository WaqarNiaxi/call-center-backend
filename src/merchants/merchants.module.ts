import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Merchant, MerchantSchema } from './schemas/merchant.schema';
import { MerchantController } from './merchants.controller';
import { MerchantService } from './merchants.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }])],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
