import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommissionSetting, CommissionSettingSchema } from './schemas/commission-setting.schema';
import { CommissionSettingsService } from './commission-settings.service';
import { CommissionSettingsController } from './commission-settings.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommissionSetting.name, schema: CommissionSettingSchema },
    ]),
    UsersModule
  ],
  controllers: [CommissionSettingsController],
  providers: [CommissionSettingsService],
  exports: [CommissionSettingsService],
})
export class CommissionSettingsModule {}
