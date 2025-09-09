import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class BankDetails {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Center' }) center: string;
  @Prop() accountHolder: string;
  @Prop() accountNumber: string;
  @Prop() routingNumber: string;
  @Prop() bankName: string;
}
