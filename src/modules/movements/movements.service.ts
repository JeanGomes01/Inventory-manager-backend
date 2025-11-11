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
    const { productId, quantity, type } = data;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Produto ${productId} não encontrado`);
    }

    const movementType = type.toLowerCase();

    if (movementType === 'entrada') {
      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { increment: quantity } },
      });
    } else if (movementType === 'saida') {
      if (product.quantity < quantity) {
        throw new BadRequestException('Quantidade insuficient em estoque');
      }

      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });
    } else {
      throw new BadRequestException("Tipo inválido. Use 'entrada' ou 'saida'");
    }

    return this.prisma.movement.create({
      data: { productId, quantity, type: movementType },
      include: { product: true },
    });
  }

  findAll() {
    return this.prisma.movement.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });
  }

  async findOne(id: number) {
    const movement = await this.prisma.movement.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!movement) {
      throw new NotFoundException(`Movimento ${id} não encontrado`);
    }

    return movement;
  }

  async update(id: number, data: UpdateMovementDto) {
    const movement = await this.prisma.movement.findUnique({ where: { id } });

    if (!movement) {
      throw new NotFoundException(`Movimento ${id} não encontrado`);
    }

    return this.prisma.movement.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const movement = await this.prisma.movement.findUnique({ where: { id } });

    if (!movement) {
      throw new NotFoundException(`Movimento ${id} não encontrado`);
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

  async removeAll() {
    // Pega todas as movimentações
    const movements = await this.prisma.movement.findMany();

    // Reverte o efeito no estoque de cada movimento
    for (const movement of movements) {
      const type = movement.type.toLowerCase();
      if (type === 'entrada') {
        await this.prisma.product.update({
          where: { id: movement.productId },
          data: { quantity: { decrement: movement.quantity } },
        });
      } else if (type === 'saida') {
        await this.prisma.product.update({
          where: { id: movement.productId },
          data: { quantity: { increment: movement.quantity } },
        });
      }
    }

    return this.prisma.movement.deleteMany();
  }
}
