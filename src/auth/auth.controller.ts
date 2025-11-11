import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { IAuthenticatedUser } from './IAuth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  async login(@Body() body: LoginDto) {
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
