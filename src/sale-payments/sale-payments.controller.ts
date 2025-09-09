// src/sale-payments/sale-payments.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SalePaymentsService } from './sale-payments.service';
import { RequestSalePaymentDto } from './dto/request-sale-payment.dt/request-sale-payment.dt';
import { UpdateSalePaymentStatusDto } from './dto/update-sale-payment-status.dto/update-sale-payment-status.dto';
import { ApiQuery } from '@nestjs/swagger';

// Import your auth & roles guards/decorators as appropriate
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard';
// import { Roles } from '../auth/roles.decorator';

@Controller('sale-payments')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class SalePaymentsController {
  constructor(private readonly service: SalePaymentsService) {}

  // Agent / Center requests payout
  // @Roles('agent', 'center_admin')
  @Post('request')
  async request(@Req() req: any, @Body() dto: RequestSalePaymentDto) {
    const userId = req.user?._id; // adapt to your auth payload
    return this.service.requestPayout(userId, dto);
  }

  // Super-admin status updates
  // @Roles('super_admin')
  @Patch('status')
  async updateStatus(@Body() dto: UpdateSalePaymentStatusDto) {
    return this.service.adminUpdateStatus(dto);
  }

  // Center listing
  // @Roles('center_admin', 'super_admin') // super-admin might pass centerId in query
  @Get()
  async list(@Req() req: any, @Query('centerId') centerId?: string) {
    const resolvedCenterId = centerId || req.user?.center; // adapt to your auth model
    return this.service.findAllByCenter(resolvedCenterId);
  }

  // src/sale-payments/sale-payments.controller.ts

@Get('all')
@ApiQuery({ name: 'status', required: false })
@ApiQuery({ name: 'from', required: false })
@ApiQuery({ name: 'to', required: false })
@ApiQuery({ name: 'centerId', required: false })
async listAll(
  @Query('status') status?: string,
  @Query('from') from?: string, // ISO date string
  @Query('to') to?: string,     // ISO date string
  @Query('centerId') centerId?: string,
) {
  return this.service.findAllWithFilters({ status, from, to, centerId });
}


  // Detail
  // @Roles('center_admin', 'super_admin')
  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
