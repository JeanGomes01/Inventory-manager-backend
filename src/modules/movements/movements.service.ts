import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { MovementsType } from './types/movements-type.enum';

@Injectable()
export class MovementsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMovementDto, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: data.productId,
        userId,
      },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    let newQuantity = product.quantity;

    if (data.type === MovementsType.ENTRADA) {
      newQuantity += data.quantity;
    }

    if (data.type === MovementsType.SAIDA) {
      if (product.quantity < data.quantity) {
        throw new BadRequestException('Estoque insuficiente');
      }
      newQuantity -= data.quantity;
    }

    const movement = await this.prisma.movement.create({
      data: {
        userId,
        productId: product.id,
        productName: product.name,
        type: data.type,
        quantity: data.quantity,
        price: data.price,
      },
    });

    await this.prisma.product.update({
      where: { id: product.id },
      data: {
        quantity: newQuantity,
      },
    });

    return movement;
  }

  findAll(userId: number) {
    return this.prisma.movement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const movement = await this.prisma.movement.findFirst({
      where: { id, userId },
    });

    if (!movement) {
      throw new BadRequestException('Movimentação não encontrada.');
    }

    return movement;
  }

  async update(id: number, data: UpdateMovementDto, userId: number) {
    const movement = await this.prisma.movement.findFirst({
      where: { id, userId },
    });

    if (!movement) {
      throw new BadRequestException('Movimentação não encontrada.');
    }

    return this.prisma.movement.update({
      where: { id },
      data,
    });
  }

  async removeAll(userId: number) {
    await this.prisma.movement.deleteMany({
      where: { userId },
    });

    return { message: 'Histórico limpo com sucesso.' };
  }
}
