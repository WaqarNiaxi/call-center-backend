// src/config/mongoose.config.ts
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const DatabaseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('MONGO_URI');
    if (!uri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    return {
      uri,
    };
  },
});
