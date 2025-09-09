// src/sale-payments/sale-payments.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SalePayment, SalePaymentDocument } from './schemas/sale-payment.schema/sale-payment.schema';
import { Sale, SaleDocument } from '../sales/schemas/sale.schema';
import { CommissionSetting, CommissionSettingDocument } from 'src/commission-settings/schemas/commission-setting.schema';
import { RequestSalePaymentDto } from './dto/request-sale-payment.dt/request-sale-payment.dt';
import { UpdateSalePaymentStatusDto } from './dto/update-sale-payment-status.dto/update-sale-payment-status.dto';

@Injectable()
export class SalePaymentsService {
  constructor(
    @InjectModel(SalePayment.name) private salePaymentModel: Model<SalePaymentDocument>,
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(CommissionSetting.name) private csModel: Model<CommissionSettingDocument>,
  ) {}

  /**
   * Create (idempotently) a SalePayment when a Sale is approved.
   * Call this from your Sale update flow when status transitions to 'approved'.
   */
  async ensureCreatedForApprovedSale(saleId: string | Types.ObjectId): Promise<SalePaymentDocument> {
    console.log("saleId : ",saleId)
    const sale = await this.saleModel
      .findById(saleId)
      .populate([
        { path: 'submittedBy', select: '_id center role' },
        { path: 'merchant', select: '_id name' },
      ])
      .lean<Sale & { _id: Types.ObjectId }>();

    if (!sale) throw new NotFoundException('Sale not found');
    if (sale.status !== 'approved') {
      throw new BadRequestException('Sale is not approved');
    }

    // Narrow submittedBy type (your User schema may vary)
    const submittedBy = sale.submittedBy as unknown as { _id: Types.ObjectId; center?: Types.ObjectId };
    const centerId = submittedBy?.center || submittedBy?._id;

    // CommissionSetting must exist for centerId (unique by centerId)
    const commission = await this.csModel.findOne({ centerId }).exec();
    if (!commission) throw new BadRequestException('CommissionSetting not found for center');

    // Idempotent: don’t create duplicates for same sale
    const existing = await this.salePaymentModel.findOne({ saleId: sale._id });
    if (existing) return existing;

    // Compute amounts
    const saleAmount = sale.amount;
    const commissionPercentage = commission.commissionPercentage;
    const commissionAmount = Number(((saleAmount * commissionPercentage) / 100).toFixed(2));

    const chargebackFeeApplied = 0;
    const netPayable = Number((saleAmount - commissionAmount - chargebackFeeApplied).toFixed(2));

    // Determine payableOn date: sale.createdAt + clearingDays
    const saleCreatedAt = sale.createdAt ? new Date(sale.createdAt) : new Date();
    const payableOn = new Date(saleCreatedAt);
    payableOn.setDate(payableOn.getDate() + commission.clearingDays);

    const doc = await this.salePaymentModel.create({
      saleId: sale._id,
      commissionSettingId: commission._id,
      centerId,
      agentId: submittedBy?._id,
      saleAmount,
      commissionPercentage,
      commissionAmount,
      chargebackFeeApplied,
      netPayable,
      status: 'draft',
      clearingDaysSnapshot: commission.clearingDays,
      payableOn,
    });

    return doc;
  }



  // src/sale-payments/sale-payments.service.ts

async findAllWithFilters(filters: {
  status?: string;
  from?: string;
  to?: string;
  centerId?: string | Types.ObjectId;
}) {
  const query: any = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.centerId) {
    query.centerId = new Types.ObjectId(filters.centerId);
  }

  if (filters.from || filters.to) {
    query.createdAt = {};
    if (filters.from) {
      query.createdAt.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.createdAt.$lte = new Date(filters.to);
    }
  }

  return this.salePaymentModel
    .find(query)
    .populate([
      { path: 'saleId', select: 'amount status createdAt' },  // Sale info
      { path: 'commissionSettingId' },                        // Full commission setting object
      { path: 'centerId' },                                   // Full center object
      { path: 'agentId' },                                    // Full agent object
    ])
    .sort({ createdAt: -1 })
    .exec();
}





  /**
   * Center/Agent requests payout for a sale payment.
   */
// Service
async requestPayout(
  userId: Types.ObjectId,
  dto: RequestSalePaymentDto
): Promise<SalePaymentDocument> {
  // Ensure sale belongs to this agent (security check)
  const payment = await this.salePaymentModel.findOne({
    saleId: dto.saleId,
  });

  if (!payment) throw new NotFoundException('Sale payment not found');

  if (payment.status !== 'draft') {
    throw new BadRequestException(
      `Cannot request payout from status=${payment.status}`
    );
  }

  payment.status = 'requested';
  payment.requestedAt = new Date();
  if (dto.note) payment.note = dto.note;

  await payment.save();
  return payment;
}


  /**
   * Super-admin updates status
   */
 async adminUpdateStatus(dto: UpdateSalePaymentStatusDto): Promise<SalePaymentDocument> {
  const payment = await this.salePaymentModel.findById(dto.id);
  if (!payment) throw new NotFoundException('Sale payment not found');

  const now = new Date();

  switch (dto.status) {
    case 'paid':
      if (payment.status !== 'draft') {
        throw new BadRequestException(`Cannot mark paid from status=${payment.status}`);
      }
      payment.status = 'paid';
      payment.paidAt = now;
      payment.payoutReference = dto.payoutReference || payment.payoutReference;
      break;

    case 'canceled':
      if (payment.status !== 'draft') {
        throw new BadRequestException(`Cannot cancel from status=${payment.status}`);
      }
      payment.status = 'canceled';
      payment.canceledAt = now;
      if (dto.note) payment.note = dto.note;
      break;

    case 'draft':
      // Usually payments are created in draft automatically, 
      // but allowing explicit update if needed
      payment.status = 'draft';
      break;

    default:
      throw new BadRequestException('Unsupported status (allowed: draft, paid, canceled)');
  }

  await payment.save();
  return payment;
}


  async findAllByCenter(centerId: string | Types.ObjectId) {
    return this.salePaymentModel
      .find({ centerId })
      .populate([{ path: 'saleId', select: 'amount status createdAt' }])
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const payment = await this.salePaymentModel.findById(id).populate([
      { path: 'saleId', select: 'amount status createdAt' },
      { path: 'commissionSettingId' },
    ]);
    if (!payment) throw new NotFoundException('Sale payment not found');
    return payment;
  }
}
