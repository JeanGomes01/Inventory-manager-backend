import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';

@Injectable()
export class MovementsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMovementDto) {
    const { userId, productName, quantity, price, type } = data;

    if (!['entrada', 'saida'].includes(type.toLowerCase())) {
      throw new BadRequestException('Tipo de movimentação inválido.');
    }

    return await this.prisma.movement.create({
      data: { userId, productName, quantity, price, type: type.toLowerCase() },
    });
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

  // 🔥 NOVO: DELETE
  async remove(id: number, userId: number) {
    const movement = await this.prisma.movement.findFirst({
      where: { id, userId },
    });

    if (!movement) {
      throw new BadRequestException('Movimentação não encontrada.');
    }

    await this.prisma.movement.delete({ where: { id } });

    return { message: 'Movimentação removida com sucesso.' };
  }
}
