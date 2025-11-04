import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createBatchDto: CreateBatchDto) {
    const { productId, quantity, expiration } = createBatchDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Produto com id ${productId} não encontrado.`,
      );
    }

    return this.prisma.batch.create({
      data: {
        productId,
        quantity,
        expiration,
      },
      include: { product: true },
    });
  }

  findAll() {
    return this.prisma.batch.findMany({
      include: { product: true },
      orderBy: { expiration: 'asc' },
    });
  }

  async findOne(id: number) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!batch) {
      throw new NotFoundException(`Batch com id ${id} não encontrado.`);
    }
    return batch;
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    const batch = await this.prisma.batch.findUnique({ where: { id } });
    if (!batch) {
      throw new NotFoundException(`Batch com id ${id} não encontrado.`);
    }

    return this.prisma.batch.update({
      where: { id },
      data: updateBatchDto,
      include: { product: true },
    });
  }

  async remove(id: number) {
    const batch = await this.prisma.batch.findUnique({ where: { id } });
    if (!batch) {
      throw new NotFoundException(`Batch com id ${id} não encontrado.`);
    }

    return this.prisma.batch.delete({ where: { id } });
  }
}
