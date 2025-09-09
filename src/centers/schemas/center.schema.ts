import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema()
export class Center {
  @Prop() name: string;
  @Prop() commissionPercent: number;
  @Prop() chargebackFee: number;
  @Prop() clearingDays: number;
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Merchant' }]) merchants: string[];
}
