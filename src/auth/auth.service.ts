// src/auth/auth.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../modules/users/users.service';
import { IAuthenticatedUser } from './IAuth.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<IAuthenticatedUser, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);

    console.log('Email recebido:', email);
    console.log('Senha recebida:', password);
    console.log('Usuário encontrado:', user);

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
    return null;
  }

  async login(user: IAuthenticatedUser) {
    const payload = { email: user.email, sub: user.id };

    const userData = await this.usersService.findByEmail(user.email);

    if (!userData) {
      throw new NotFoundException('User not found');
    }

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
    };
  }
}
