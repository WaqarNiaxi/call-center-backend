import { Controller,UseGuards, Get, Post, Body, Param, Delete, Put, UsePipes, ValidationPipe ,Request} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './schemas/sale.schema';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, type: Sale })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }


  @UseGuards(JwtAuthGuard) 
  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  findAll(@Request() req) {
    console.log('Decoded user:', req.user); 
    return this.salesService.findAll(req.user);
  }



  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Update a sale' })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale' })
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
