import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar nova venda
  async create(createHistoryDto: CreateHistoryDto) {
    const { clientId, date, total } = createHistoryDto;

    // Verificar se o cliente existe
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      throw new NotFoundException(`Cliente com id ${clientId} não encontrado.`);
    }

    return this.prisma.sales.create({
      data: {
        clientId,
        date,
        total,
      },
      include: { client: true },
    });
  }

  // Listar todas as vendas
  findAll() {
    return this.prisma.sales.findMany({
      include: { client: true },
      orderBy: { date: 'desc' },
    });
  }

  // Buscar venda por id
  async findOne(id: number) {
    const sale = await this.prisma.sales.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!sale) {
      throw new NotFoundException(`Venda com id ${id} não encontrada.`);
    }

    return sale;
  }

  // Atualizar venda
  async update(id: number, updateHistoryDto: UpdateHistoryDto) {
    const sale = await this.prisma.sales.findUnique({ where: { id } });
    if (!sale) {
      throw new NotFoundException(`Venda com id ${id} não encontrada.`);
    }

    return this.prisma.sales.update({
      where: { id },
      data: updateHistoryDto,
      include: { client: true },
    });
  }

  // Remover venda
  async remove(id: number) {
    const sale = await this.prisma.sales.findUnique({ where: { id } });
    if (!sale) {
      throw new NotFoundException(`Venda com id ${id} não encontrada.`);
    }

    return this.prisma.sales.delete({ where: { id } });
  }
}
