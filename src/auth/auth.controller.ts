import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IAuthenticatedUser } from './IAuth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user: IAuthenticatedUser | null = await this.authService.validateUser(
      body.email,
      body.password,
    );

    if (!user) {
      return { message: 'Usuário ou senha inválidos' };
    }
    return this.authService.login(user);
  }
}
