import { ApiProperty } from '@nestjs/swagger';
import { MovementsType } from '../types/movements-type.enum';

export class CreateMovementDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: MovementsType })
  type: MovementsType;
}
