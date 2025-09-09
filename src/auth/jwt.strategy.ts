// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Token expiration will be checked
      secretOrKey: configService.get<string>('JWT_SECRET'), // Make sure you have this in your .env
    });
  }

  async validate(payload: any) {
    // payload comes from token (when you sign it)
    // Example: { sub: userId, email: email }
    return { userId: payload.sub, email: payload.email };
  }
}
