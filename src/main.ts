import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Inventory Manager API')
    .setDescription('The Inventory Manager API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:3000',
      'http://localhost:3000/api',
    ],
  });

  await app.listen(3000);
  console.log(`🚀 Server rodando em http://localhost:3000`);
  console.log(`📘 Swagger: http://localhost:3000/api`);
}
bootstrap().catch((err) => console.error(err));
