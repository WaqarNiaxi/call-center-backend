import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Merchant, MerchantDocument } from './schemas/merchant.schema';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(Merchant.name) private merchantModel: Model<MerchantDocument>,
  ) {}

  async create(createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    const merchant = new this.merchantModel(createMerchantDto);
    return merchant.save();
  }

  async findAll(): Promise<Merchant[]> {
    return this.merchantModel.find().exec();
  }

  async findOne(id: string): Promise<Merchant> {
    const merchant = await this.merchantModel.findById(id).exec();
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  async update(id: string, updateMerchantDto: UpdateMerchantDto): Promise<Merchant> {
    const merchant = await this.merchantModel
      .findByIdAndUpdate(id, updateMerchantDto, { new: true })
      .exec();
    if (!merchant) throw new NotFoundException('Merchant not found');
    return merchant;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.merchantModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Merchant not found');
    return { message: 'Merchant deleted successfully' };
  }
}
