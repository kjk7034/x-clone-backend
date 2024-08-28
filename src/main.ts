import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Next.js 앱의 도메인
    credentials: true, // 쿠키 허용
  };
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
