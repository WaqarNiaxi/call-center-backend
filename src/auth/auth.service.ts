// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
  if (!user.status) {
    throw new UnauthorizedException('User is not active. Please contact admin.');
  }

  const payload = {
    sub: user._id,
    email: user.email,
    role: user.role,
    center: user.center || null,
  };

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      email: user.email,
      id: user._id,
      role: user.role,
      center: user.center || null,
    },
  };
}

}
