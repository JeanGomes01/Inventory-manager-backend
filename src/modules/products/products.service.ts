import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create(data: CreateProductDto, userId: number) {
    const product = await this.prisma.product.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: 0,
      },
    });

    if (data.quantity > 0) {
      await this.movementsService.create({
        userId,
        productId: product.id,
        quantity: data.quantity,
        type: 'entrada',
      });
    }

    return this.prisma.product.findUnique({
      where: { id: product.id },
      include: { movements: true },
    });
  }

  findAll(userId: number) {
    return this.prisma.product.findMany({
      where: { userId },
      include: { movements: true },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.product.findFirst({
      where: { id, userId },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) {
      throw new NotFoundException(
        `Produto ${id} não encontrado para o usuário.`,
      );
    }

    await this.prisma.movement.deleteMany({
      where: { productId: id, userId },
    });

    return this.prisma.product.delete({
      where: { id, userId },
    });
  }

  async removeAll(userId: number) {
    await this.prisma.movement.deleteMany({ where: { userId } });
    return this.prisma.product.deleteMany({ where: { userId } });
  }
}
