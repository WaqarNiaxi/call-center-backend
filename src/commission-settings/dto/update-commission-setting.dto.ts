import { PartialType } from '@nestjs/swagger';
import { CreateCommissionSettingDto } from './create-commission-setting.dto';

export class UpdateCommissionSettingDto extends PartialType(CreateCommissionSettingDto) {}
