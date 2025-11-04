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
  constructor(private readonly prisma: PrismaService) {}

  async create(createMovementDto: CreateMovementDto) {
    const { productId, quantity, type } = createMovementDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Produto ${productId} não encontrado`);

    if (type.toLowerCase() === 'entrada') {
      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { increment: quantity } },
      });
    } else if (type.toLowerCase() === 'saida') {
      if (product.quantity < quantity)
        throw new BadRequestException('Quantidade insuficiente');
      await this.prisma.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });
    } else {
      throw new BadRequestException("Tipo inválido. Use 'entrada' ou 'saida'");
    }

    return this.prisma.movements.create({
      data: { productId, quantity, type },
    });
  }

  findAll() {
    return this.prisma.movements.findMany({ orderBy: { date: 'desc' } });
  }

  async findOne(id: number) {
    const movement = await this.prisma.movements.findUnique({ where: { id } });
    if (!movement)
      throw new NotFoundException(`Movimento ${id} não encontrado`);
    return movement;
  }

  async update(id: number, updateMovementDto: UpdateMovementDto) {
    const movement = await this.prisma.movements.findUnique({ where: { id } });
    if (!movement)
      throw new NotFoundException(`Movimento ${id} não encontrado`);
    return this.prisma.movements.update({
      where: { id },
      data: updateMovementDto,
    });
  }

  async remove(id: number) {
    const movement = await this.prisma.movements.findUnique({ where: { id } });
    if (!movement)
      throw new NotFoundException(`Movimento ${id} não encontrado`);

    // desfaz alteração no estoque
    if (movement.type.toLowerCase() === 'entrada') {
      await this.prisma.product.update({
        where: { id: movement.productId },
        data: { quantity: { decrement: movement.quantity } },
      });
    } else if (movement.type.toLowerCase() === 'saida') {
      await this.prisma.product.update({
        where: { id: movement.productId },
        data: { quantity: { increment: movement.quantity } },
      });
    }

    return this.prisma.movements.delete({ where: { id } });
  }
}
