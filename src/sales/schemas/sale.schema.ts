import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  submittedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  processedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Merchant', required: true })
  merchant: Types.ObjectId;

  @Prop({ required: true })
  cardNumber: string; // Store encrypted or masked only

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: true })
  cvv: string;

  @Prop({ required: true })
  billingAddress: string;

  @Prop({ required: true })
  amount: number;

  @Prop({
    enum: ['pending', 'approved', 'declined', 'refunded'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'declined' | 'refunded';

  @Prop()
  feedbackNote?: string;

  @Prop()
  processedAt?: Date;

  @Prop()
  availableAt?: Date; // for clearing

  
 readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
