import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  app.use('/api/uploads', express.static(join(__dirname, '..', 'uploads')));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  await app.listen(port);

  // console.log(`Server is running on port ${port}`);
}
bootstrap();
