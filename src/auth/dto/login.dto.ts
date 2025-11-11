import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jeangomesdev@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}
