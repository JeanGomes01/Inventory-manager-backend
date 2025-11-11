import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovementsService } from '../movements/movements.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private movementsService: MovementsService,
  ) {}

  async create(data: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        price: data.price,
      },
    });

    if (data.quantity > 0) {
      await this.movementsService.create({
        productId: product.id,
        quantity: data.quantity,
        type: 'entrada',
      });
    }

    return product;
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }

  async removeAll() {
    await this.prisma.movement.deleteMany();
    return this.prisma.product.deleteMany();
  }
}
