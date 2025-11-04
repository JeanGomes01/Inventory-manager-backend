// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../modules/users/users.service';
import { IJwtPayload } from './IAuth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SUA_CHAVE_SECRETA',
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) return null;
    return { userId: user.id, email: user.email };
  }
}
