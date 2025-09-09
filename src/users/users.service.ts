// src/users/users.service.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcryptjs'
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { FilterQuery } from 'mongoose';



@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

 async create(createUserDto: CreateUserDto): Promise<User> {
  try {
    const { email, role, password, center } = createUserDto;

    // ✅ Validate role
    if (!Object.values(Role).includes(role as Role)) {
      throw new BadRequestException(`Invalid role. Must be one of: center_admin, sub_admin, agent`);
    }

    // ✅ Block creating super_admin
    if (role === Role.SUPER_ADMIN) {
      throw new BadRequestException('Cannot assign role "super_admin"');
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    // ✅ Check if email already exists
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }

    // ✅ Role-based center validation
    if (role === Role.AGENT) {
      if (!center) {
        throw new BadRequestException('Agent must have a valid center ID');
      }
      if (!mongoose.Types.ObjectId.isValid(center)) {
        throw new BadRequestException('Invalid center ID format');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Only include center if applicable
    const userData: any = {
      ...createUserDto,
      password: hashedPassword,
      status: false,
    };
    if (role === Role.AGENT) {
      userData.center = center;
    } else {
      delete userData.center; // prevent empty string error
    }

    const createdUser = new this.userModel(userData);
    return await createdUser.save();

  } catch (error) {
    if (error instanceof BadRequestException) throw error;

    if (error.code === 11000) {
      throw new BadRequestException('Email or username already exists');
    }

    console.error('Error creating user:', error);
    throw new InternalServerErrorException(error.message || 'Failed to create user');
  }
}

async findAllByCenter(centerId: string) {
  return this.userModel.find({ center: new Types.ObjectId(centerId) }).exec();
}
// async findAllByCenter(centerId: string) {
//   return this.userModel.find({ role: 'agent', center: centerId.toString() });
// }



async findByEmail(email: string): Promise<User | null> {
  return this.userModel.findOne({ email });
}

  async updateStatus(userId: string, newStatus: boolean, requester: User): Promise<User> {
    if (requester.role !== 'super_admin') {
      throw new ForbiddenException('Only super_admin can update user status');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.status = newStatus;
    return await user.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findAll(user: any): Promise<any> {
    console.log(user)
    return this.userModel.find();
  }

   async findAllfilterUser(filter: FilterQuery<User> = {}): Promise<User[]> {
    return this.userModel.find(filter).lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  try {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return await user.save();
  } catch (error) {
    throw new InternalServerErrorException('Failed to update user');
  }
}

async remove(id: string): Promise<{ message: string }> {
  const user = await this.userModel.findById(id);
  if (!user) throw new NotFoundException('User not found');

  await this.userModel.deleteOne({ _id: id });
  return { message: 'User deleted successfully' };
}


}
