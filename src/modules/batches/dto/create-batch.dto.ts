import { ApiProperty } from '@nestjs/swagger';

export class CreateBatchDto {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  expiration: Date;
}
