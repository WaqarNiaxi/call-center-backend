import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Error as MongooseError } from 'mongoose';
import {
  CommissionSetting,
  CommissionSettingDocument,
} from './schemas/commission-setting.schema';
import { CreateCommissionSettingDto } from './dto/create-commission-setting.dto';
import { UpdateCommissionSettingDto } from './dto/update-commission-setting.dto';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class CommissionSettingsService {
  constructor(
    @InjectModel(CommissionSetting.name)
    private readonly csModel: Model<CommissionSettingDocument>,
    private readonly usersService: UsersService,
  ) {}

async create(dto: CreateCommissionSettingDto): Promise<CommissionSetting> {
  try {
    // ✅ Check if user exists
    const user = await this.usersService.findById(dto.centerId);
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.centerId} not found`);
    }

    // ✅ Check if user has CENTER_ADMIN role
    if (user.role !== Role.CENTER_ADMIN) {
      throw new ForbiddenException(
        `User with ID ${dto.centerId} is not a CENTER_ADMIN`,
      );
    }

    // ✅ Check if commission setting already exists (convert to ObjectId!)
    const existing = await this.csModel.findOne({
      centerId: new Types.ObjectId(dto.centerId),
    });
    if (existing) {
      throw new ConflictException(
        `Commission settings for center ${dto.centerId} already exist`,
      );
    }

    // ✅ Create commission setting
    console.log(dto)
    const doc = new this.csModel({
      centerId: new Types.ObjectId(dto.centerId),
      commissionPercentage: dto.commissionPercentage,
      chargebackFee: dto.chargebackFee,
      clearingDays: dto.clearingDays,
    });

    return await doc.save();
  } catch (e) {
    console.log(e)
    this.handleMongooseError(e);
  }
}



  async upsertByCenter(
    centerId: string,
    dto: UpdateCommissionSettingDto | CreateCommissionSettingDto,
  ) {
    try {
      const update = {
        commissionPercentage: dto.commissionPercentage,
        chargebackFee: dto.chargebackFee,
        clearingDays: dto.clearingDays,
      };

      const res = await this.csModel.findOneAndUpdate(
        { centerId: new Types.ObjectId(centerId) },
        { $set: update },
        { new: true, upsert: true, runValidators: true },
      );
      return res;
    } catch (e) {
      this.handleMongooseError(e);
    }
  }

  async findByCenter(centerId: string): Promise<CommissionSetting> {
    const doc = await this.csModel
      .findOne({ centerId: new Types.ObjectId(centerId) })
      .exec();
    if (!doc) {
      throw new NotFoundException(
        `Commission settings for center ${centerId} not found`,
      );
    }
    return doc;
  }

  async findAll(): Promise<CommissionSetting[]> {
    return this.csModel.find().populate('centerId').exec();
  }

  async updateByCenter(
    centerId: string,
    dto: UpdateCommissionSettingDto,
  ): Promise<CommissionSetting> {
    try {
      const update = {
        commissionPercentage: dto.commissionPercentage,
        chargebackFee: dto.chargebackFee,
        clearingDays: dto.clearingDays,
      };

      const doc = await this.csModel.findOneAndUpdate(
        { centerId: new Types.ObjectId(centerId) },
        { $set: update },
        { new: true, runValidators: true },
      );
      if (!doc) {
        throw new NotFoundException(
          `Commission settings for center ${centerId} not found`,
        );
      }
      return doc;
    } catch (e) {
      this.handleMongooseError(e);
    }
  }


  async findAvailableCenters() {
  // Step 1: get all centerIds already used in commission settings
  const existingSettings = await this.csModel.find({}, 'centerId').lean();
  const usedCenterIds = existingSettings.map((cs) => cs.centerId.toString());

  // Step 2: fetch users with role CENTER_ADMIN that are not in usedCenterIds
  const availableCenters = await this.usersService.findAllfilterUser({
    role: Role.CENTER_ADMIN,
    _id: { $nin: usedCenterIds },
  });

  return availableCenters;
}

  

  async removeByCenter(centerId: string): Promise<void> {
    const res = await this.csModel
      .findOneAndDelete({ centerId: new Types.ObjectId(centerId) })
      .exec();
    if (!res) {
      throw new NotFoundException(
        `Commission settings for center ${centerId} not found`,
      );
    }
  }

  private handleMongooseError(error: any): never {
    if (error instanceof MongooseError.ValidationError) {
      throw new BadRequestException(error.message);
    }
    // duplicate key (unique index on centerId)
    // @ts-ignore
    if (error?.code === 11000) {
      throw new ConflictException(
        'Commission settings for this center already exist',
      );
    }
    throw error;
  }
}
