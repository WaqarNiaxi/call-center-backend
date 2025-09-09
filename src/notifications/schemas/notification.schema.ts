import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Notification {
  @Prop() message: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: 'relatedToModel' }) relatedTo: string;
  @Prop() relatedToModel: string; // Sale or Withdrawal
  @Prop() createdAt: Date;
  @Prop({ default: false }) isRead: boolean;
}
