import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('blockchain-service API Doc')
    .setDescription('Hedera blockchain service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerUiEnabled: process.env.NODE_ENV !== 'production',
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.BLOCKCHAIN_PORT ?? 3000;
  await app.listen(port);
  logger.log(`Blockchain service is running at: http://localhost:${port}`);
  logger.log(`Swagger docs available at: http://localhost:${port}/api-docs`);
}

bootstrap().catch((error: Error) => {
  logger.error('App failed to start:', error);
  process.exit(1);
});
