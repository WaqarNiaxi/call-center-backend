// src/sale-payments/schemas/sale-payment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SalePaymentDocument = SalePayment & Document;

export type SalePaymentStatus =
  | 'draft'         // created automatically on sale approval
  | 'requested'     // center/agent requested
  | 'approved'      // super-admin approved payout
  | 'paid'          // super-admin sent payment
  | 'declined'      // super-admin declined
  | 'canceled';     // requester canceled (optional)

@Schema({ timestamps: true })
export class SalePayment {
  @Prop({ type: Types.ObjectId, ref: 'Sale', required: true, unique: true })
  saleId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CommissionSetting', required: true })
  commissionSettingId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // center admin user id
  centerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // the agent who submitted the sale
  agentId: Types.ObjectId;

  // Snapshot amounts (so later config changes don’t retroactively change historical payouts)
  @Prop({ required: true })
  saleAmount: number;

  @Prop({ required: true })
  commissionPercentage: number; // snapshot from CommissionSetting

  @Prop({ required: true })
  commissionAmount: number; // saleAmount * commissionPercentage / 100

  @Prop({ default: 0 })
  chargebackFeeApplied?: number; // 0 normally; could be > 0 for chargebacks if you implement that flow

  @Prop({ required: true })
  netPayable: number; // saleAmount - commissionAmount - chargebackFeeApplied

  @Prop({
    enum: ['draft', 'requested', 'approved', 'paid', 'declined', 'canceled'],
    default: 'draft',
  })
  status: SalePaymentStatus;

  @Prop()
  requestedAt?: Date;

  @Prop()
  approvedAt?: Date;

  @Prop()
  paidAt?: Date;

  @Prop()
  declinedAt?: Date;

  @Prop()
  canceledAt?: Date;

  @Prop()
  clearingDaysSnapshot?: number; // snapshot from CommissionSetting at time of creation

  // Funds eligible date (sale.createdAt + clearingDays). You can also copy from Sale.availableAt if you already set it there.
  @Prop()
  payableOn?: Date;

  // Optional: payment metadata
  @Prop()
  payoutReference?: string; // bank txn id / ref

  @Prop()
  note?: string;
}

export const SalePaymentSchema = SchemaFactory.createForClass(SalePayment);
