import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from './schemas/sale.schema';
import { UsersModule } from 'src/users/users.module';
import { SalePaymentsModule } from 'src/sale-payments/sale-payments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    UsersModule,
    SalePaymentsModule
  ],
  providers: [SalesService],
  controllers: [SalesController],
})
export class SalesModule {}
