import { ApiProperty } from '@nestjs/swagger';

export class CreateHistoryDto {
  @ApiProperty()
  clientId: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  total: number;
}
