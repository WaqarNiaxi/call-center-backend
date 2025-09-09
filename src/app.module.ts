// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/mongoose.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SalesModule } from './sales/sales.module';
import { MerchantModule } from './merchants/merchants.module';
import { CommissionSettingsModule } from './commission-settings/commission-settings.module';
import { SalePaymentsModule } from './sale-payments/sale-payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    SalesModule,
    MerchantModule,
    CommissionSettingsModule,
    CommissionSettingsModule,
    SalePaymentsModule
  ],
})
export class AppModule {}
