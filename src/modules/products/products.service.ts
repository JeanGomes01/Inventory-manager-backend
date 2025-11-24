import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
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
        quantity: data.quantity ?? 0,
        categoryId,
      },
      include: { category: true },
    });

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      categoryId: product.categoryId,
      userId: product.userId,
      category: product.category?.name ?? null,
    };
  }

  async findOne(id: number, userId: number) {
    return this.prisma.product.findFirst({
      where: { id, userId },
      include: { category: true },
    });
  }

  async findAll(userId: number) {
    const products = await this.prisma.product.findMany({
      where: { userId },
      include: { category: true },
    });

    return products.map((product) => ({
      ...product,
      category: product.category?.name ?? null,
      quantity: product.quantity,
    }));
  }

  async update(id: number, data: UpdateProductDto, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

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

    const dataToUpdate: any = { ...data };
    delete dataToUpdate.category;
    delete dataToUpdate.quantity;
    if (categoryId !== undefined) dataToUpdate.categoryId = categoryId;

    const updated = await this.prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: { category: true },
    });

    return {
      ...updated,
      category: updated.category?.name ?? null,
    };
  }

  async remove(id: number, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, userId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
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
