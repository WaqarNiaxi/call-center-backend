// src/seed/super-admin.seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums/role.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const existing = await usersService.findByUsername('superadmin');
  if (existing) {
    console.log('Super Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  await usersService.create({
    username: 'superadmin',
    password: hashedPassword,
    email:"waqarniazi51@gmail.com",
    role: Role.SUPER_ADMIN,
    center: "",
  });

  console.log('Super Admin created');
  process.exit(0);
}

bootstrap();
