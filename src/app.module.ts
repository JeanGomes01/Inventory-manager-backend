import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertsModule } from './modules/alerts/alerts.module';
import { BatchesModule } from './modules/batches/batches.module';
import { HistoryModule } from './modules/history/history.module';
import { MovementsModule } from './modules/movements/movements.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    UsersModule,
    BatchesModule,
    MovementsModule,
    HistoryModule,
    AlertsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
