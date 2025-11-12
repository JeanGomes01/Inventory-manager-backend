import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@UseGuards(AuthGuard('jwt'))
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  findAll(@Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.productsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.productsService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    const userId = (req.user as { id: number }).id;
    return this.productsService.update(+id, updateProductDto, userId);
  }
  @Delete('all')
  removeAll(@Req() req) {
    const userId = (req.user as { id: number }).id;
    return this.productsService.removeAll(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const parsedId = Number(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID inválido');
    }
    const userId = (req.user as { id: number }).id;
    return this.productsService.remove(parsedId, userId);
  }
}
