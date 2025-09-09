// src/sale-payments/sale-payments.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalePaymentsService } from './sale-payments.service';
import { SalePaymentsController } from './sale-payments.controller';
import { SalePayment, SalePaymentSchema } from './schemas/sale-payment.schema/sale-payment.schema';
// Import your existing modules to access Sale, CommissionSetting, and Users
import { Sale, SaleSchema } from '../sales/schemas/sale.schema';
import { CommissionSetting, CommissionSettingSchema } from 'src/commission-settings/schemas/commission-setting.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SalePayment.name, schema: SalePaymentSchema },
      { name: Sale.name, schema: SaleSchema },
      { name: CommissionSetting.name, schema: CommissionSettingSchema },
      { name: User.name, schema: UserSchema },
    ]),
    // forwardRef if you have circular deps with SalesModule
    // forwardRef(() => SalesModule),
  ],
  controllers: [SalePaymentsController],
  providers: [SalePaymentsService],
  exports: [SalePaymentsService],
})
export class SalePaymentsModule {}
