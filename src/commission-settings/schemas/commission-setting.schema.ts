// commission-setting.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CommissionSettingDocument = CommissionSetting & Document;

@Schema({ timestamps: true })
export class CommissionSetting {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true  })
  centerId: string; // Ref to User with role = CENTER_ADMIN

  @Prop({ required: true })
  commissionPercentage: number;

  @Prop({ required: true })
  chargebackFee: number;

  @Prop({ required: true })
  clearingDays: number;
}

export const CommissionSettingSchema = SchemaFactory.createForClass(CommissionSetting);
