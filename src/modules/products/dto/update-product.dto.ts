import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price?: number;
}
