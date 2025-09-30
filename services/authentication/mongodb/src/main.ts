import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { AppModule } from './modules/module';
import { CatchEverythingFilter } from './utils/ErrorHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
      enableDebugMessages: process.env.NODE_ENV !== 'production',
    }),
  );

  app.useGlobalFilters(new CatchEverythingFilter(app.get(HttpAdapterHost)));
  const config = new DocumentBuilder()
    .setTitle('authentication-service API Doc')
    .setDescription('The authentication-service API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5010);
  console.log(
    `Notification service is running on port http://localhost:${process.env.PORT ?? 5010} in ${
      process.env.NODE_ENV ?? 'development'
    } mode`,
  );
}
bootstrap();
