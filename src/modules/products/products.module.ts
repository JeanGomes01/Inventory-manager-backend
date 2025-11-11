import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MovementsModule } from '../movements/movements.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [PrismaModule, MovementsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
