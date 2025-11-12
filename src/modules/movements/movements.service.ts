import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';

@Injectable()
export class MovementsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMovementDto) {
    const { productId, quantity, type, userId } = data;

    const product = await this.prisma.product.findFirst({
      where: { id: productId, userId },
    });

    if (!product) {
      throw new NotFoundException(
        `Produto ${productId} não encontrado para o usuário.`,
      );
    }

    const movementType = type.toLowerCase();

    if (movementType === 'entrada') {
      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { increment: quantity } },
      });
    } else if (movementType === 'saida') {
      if (product.quantity < quantity) {
        throw new BadRequestException('Quantidade insuficiente em estoque');
      }
      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });
    } else {
      throw new BadRequestException("Tipo inválido. Use 'entrada' ou 'saida'");
    }

    return this.prisma.movement.create({
      data: { userId, productId, quantity, type: movementType },
      include: { product: true },
    });
  }

  findAll(userId: number) {
    return this.prisma.movement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });
  }

  async findOne(id: number, userId: number) {
    const movement = await this.prisma.movement.findFirst({
      where: { id, userId },
      include: { product: true },
    });

    if (!movement) {
      throw new NotFoundException(
        `Movimento ${id} não encontrado para o usuário.`,
      );
    }

    return movement;
  }

  async update(id: number, data: UpdateMovementDto, userId: number) {
    const movement = await this.prisma.movement.findFirst({
      where: { id, userId },
    });

    if (!movement) {
      throw new NotFoundException(
        `Movimento ${id} não encontrado para o usuário.`,
      );
    }

    return this.prisma.movement.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    const movement = await this.prisma.movement.findFirst({
      where: { id, userId },
    });

    if (!movement) {
      throw new NotFoundException(
        `Movimento ${id} não encontrado para o usuário.`,
      );
    }

    const movementType = movement.type.toLowerCase();

    if (movementType === 'entrada') {
      await this.prisma.product.update({
        where: { id: movement.productId },
        data: { quantity: { decrement: movement.quantity } },
      });
    } else if (movementType === 'saida') {
      await this.prisma.product.update({
        where: { id: movement.productId },
        data: { quantity: { increment: movement.quantity } },
      });
    }

    return this.prisma.movement.delete({ where: { id } });
  }

  async removeAll(userId: number) {
    const movements = await this.prisma.movement.findMany({
      where: { userId },
    });

    for (const movement of movements) {
      const type = movement.type.toLowerCase();
      if (type === 'entrada') {
        await this.prisma.product.update({
          where: { id: movement.productId },
          data: { quantity: { decrement: movement.quantity } },
        });
      } else {
        await this.prisma.product.update({
          where: { id: movement.productId },
          data: { quantity: { increment: movement.quantity } },
        });
      }
    }

    return this.prisma.movement.deleteMany({ where: { userId } });
  }
}
