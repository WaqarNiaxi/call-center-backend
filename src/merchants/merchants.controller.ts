import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MerchantService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Merchant } from './schemas/merchant.schema';

@ApiTags('Merchants')
@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new merchant' })
  @ApiResponse({ status: 201, type: Merchant })
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantService.create(createMerchantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all merchants' })
  @ApiResponse({ status: 200, type: [Merchant] })
  findAll() {
    return this.merchantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a merchant by ID' })
  @ApiResponse({ status: 200, type: Merchant })
  findOne(@Param('id') id: string) {
    return this.merchantService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a merchant by ID' })
  @ApiResponse({ status: 200, type: Merchant })
  update(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    return this.merchantService.update(id, updateMerchantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a merchant by ID' })
  @ApiResponse({ status: 200, description: 'Merchant deleted successfully' })
  remove(@Param('id') id: string) {
    return this.merchantService.remove(id);
  }
}
