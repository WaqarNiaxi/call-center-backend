import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommissionSettingsService } from './commission-settings.service';
import { CreateCommissionSettingDto } from './dto/create-commission-setting.dto';
import { UpdateCommissionSettingDto } from './dto/update-commission-setting.dto';

@Controller('commission-settings')
export class CommissionSettingsController {
  constructor(private readonly service: CommissionSettingsService) {}

  // Create (fails if already exists – use upsert if you prefer idempotence)
  @Post()
  create(@Body() dto: CreateCommissionSettingDto) {
    return this.service.create(dto);
  }

  // Idempotent upsert by center
  @Put(':centerId/upsert')
  upsertByCenter(@Param('centerId') centerId: string, @Body() dto: UpdateCommissionSettingDto) {
    return this.service.upsertByCenter(centerId, dto);
  }

  // Update by center (must exist)
  @Put(':centerId')
  updateByCenter(@Param('centerId') centerId: string, @Body() dto: UpdateCommissionSettingDto) {
    return this.service.updateByCenter(centerId, dto);
  }

  //  available centers list
  @Get('available-centers')
  findAl() {
    console.log("it's ok")
    return this.service.findAvailableCenters();
  }

  // Get by center
  @Get(':centerId')
  findByCenter(@Param('centerId') centerId: string) {
    return this.service.findByCenter(centerId);
  }



  // List all (admin use)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Delete by center
  @Delete(':centerId')
  removeByCenter(@Param('centerId') centerId: string) {
    return this.service.removeByCenter(centerId);
  }
}
