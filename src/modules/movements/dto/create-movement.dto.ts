import { ApiProperty } from '@nestjs/swagger';

export class CreateMovementDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  type: string;
}
