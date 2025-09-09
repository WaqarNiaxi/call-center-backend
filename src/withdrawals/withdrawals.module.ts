import { Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';

@Module({
  providers: [WithdrawalsService],
  controllers: [WithdrawalsController]
})
export class WithdrawalsModule {}
