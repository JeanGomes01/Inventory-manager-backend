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
    let categoryId: number | undefined;

    if (data.category) {
      let category = await this.prisma.category.findUnique({
        where: { name: data.category },
      });

      if (!category) {
        category = await this.prisma.category.create({
          data: { name: data.category },
        });
      }

      categoryId = category.id;
    }

    const product = await this.prisma.product.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: 0,
        categoryId,
      },
      include: { movements: true, category: true },
    });

    if (data.quantity > 0) {
      await this.movementsService.create({
        userId,
        productId: product.id,
        quantity: data.quantity,
        type: 'entrada',
      });
    }

    return product;
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

    let categoryId: number | undefined;
    if (updateProductDto.category) {
      let category = await this.prisma.category.findUnique({
        where: { name: updateProductDto.category },
      });

      if (!category) {
        category = await this.prisma.category.create({
          data: { name: updateProductDto.category },
        });
      }

      categoryId = category.id;
    }

    const dataToUpdate: any = { ...updateProductDto };
    delete dataToUpdate.category;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;

    return this.prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: { movements: true, category: true },
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
