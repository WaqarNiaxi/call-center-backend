import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Withdrawal {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Center' }) center: string;
  @Prop() amount: number;
  @Prop({ enum: ['pending', 'approved', 'declined'], default: 'pending' }) status: string;
  @Prop() note?: string;
  @Prop() requestedAt: Date;
  @Prop() approvedAt?: Date;
}
