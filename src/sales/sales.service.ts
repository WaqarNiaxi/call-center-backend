import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Error as MongooseError } from 'mongoose';
import { Sale, SaleDocument } from './schemas/sale.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { UsersService } from 'src/users/users.service';
import { Document, Types } from 'mongoose';
import { SalePaymentsService } from 'src/sale-payments/sale-payments.service';

export interface User extends Document {
  _id: string;
  email: string;
  username: string;
  role: string;
  center?: string | null;
}

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    private readonly userService: UsersService,
    private readonly salePaymentsService: SalePaymentsService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    try {
      const sale = new this.saleModel(createSaleDto);
      return await sale.save();
    } catch (error) {
      this.handleMongooseError(error);
    }
  }

  // async findAll(user: any): Promise<any> {
  //   const userData = await this.userService.findById(user.userId) as User;

  //   let salesQuery = this.saleModel.find();

  //   try {
  //     if (userData?.role === 'agent') {
  //       console.log("Filtering sales for agent:", userData._id);
  //       salesQuery = salesQuery.find({ submittedBy: userData._id.toString() });
  //     }

  //     const sales = await salesQuery
  //       .populate('submittedBy')
  //       .populate('merchant');

  //     return {
  //       userFromToken: userData,
  //       salesData: sales,
  //     };
  //   } catch (err) {
  //     console.error("Error in findAll:", err);
  //     throw err;
  //   }
  // }

  async findAll(user: any): Promise<any> {
    let salesQuery = this.saleModel.find();

    try {

    const userData = (await this.userService.findById(user.userId)) as User;

      if (userData?.role === 'agent') {
        //🔹 Agent only sees their own sales
        console.log('Filtering sales for agent:', userData._id);
        salesQuery = salesQuery.find({ submittedBy: userData._id.toString() });
      } else if (userData.role === 'center_admin') {
        const agents = await this.userService.findAllByCenter(
          userData._id as string,
        );
        console.log('agents:', agents);

        // Convert ObjectId -> string
        const agentIds = agents.map((agent) =>
          (agent._id as Types.ObjectId).toString(),
        );

        console.log('agentIds:', agentIds);

        salesQuery = salesQuery.find({
          submittedBy: { $in: agentIds },
        });
      }

      const sales = await salesQuery
        .populate('submittedBy')
        .populate('merchant');

      return {
        userFromToken: userData,
        salesData: sales,
      };
    } catch (err) {
      console.error('Error in findAll:', err);
      throw err;
    }
  }

  async findOne(id: string): Promise<Sale> {
    try {
      const sale = await this.saleModel
        .findById(id)
        .populate('submittedBy')
        .populate('merchant')
        .exec();
      if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
      return sale;
    } catch (error) {
      this.handleMongooseError(error);
    }
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    try {
      const sale = await this.saleModel
        .findByIdAndUpdate(id, updateSaleDto, { new: true })
        .exec();

        if (sale?.status === 'approved') {
    // Ensure payment record exists (idempotent)
   await this.salePaymentsService.ensureCreatedForApprovedSale(
  sale._id as Types.ObjectId
);

  }
      if (!sale) throw new NotFoundException(`Sale with ID ${id} not found`);
      return sale;
    } catch (error) {
      this.handleMongooseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.saleModel.findByIdAndDelete(id).exec();
      if (!result) throw new NotFoundException(`Sale with ID ${id} not found`);
    } catch (error) {
      this.handleMongooseError(error);
    }
  }

  private handleMongooseError(error: any): never {
    if (error instanceof MongooseError.CastError) {
      throw new BadRequestException(`Invalid ID format: ${error.value}`);
    }
    if (error instanceof MongooseError.ValidationError) {
      throw new BadRequestException(error.message);
    }
    throw error;
  }
}
