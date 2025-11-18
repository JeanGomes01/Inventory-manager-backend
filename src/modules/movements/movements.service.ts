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

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Produto ${productId} não encontrado.`);
    }

    if (product.userId !== userId) {
      throw new BadRequestException('Este produto não pertence ao usuário.');
    }

    const movementType = type.toLowerCase();

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
}
