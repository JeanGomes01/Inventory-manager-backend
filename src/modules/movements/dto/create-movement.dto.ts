import { ApiProperty } from '@nestjs/swagger';

export class CreateMovementDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  type: string;
}
