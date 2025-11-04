import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { BatchesModule } from './modules/batches/batches.module';
import { MovementsModule } from './modules/movements/movements.module';
import { HistoryModule } from './modules/history/history.module';
import { AlertsModule } from './modules/alerts/alerts.module';

@Module({
  imports: [PrismaModule, ProductsModule, UsersModule, BatchesModule, MovementsModule, HistoryModule, AlertsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
