import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';

process.on('unhandledRejection', (reason, promise) => {
  console.info('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.info('Uncaught Exception thrown:', error);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('notification-service API Doc')
    .setDescription('The notification-service API description.')
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

  await app.listen(process.env.NOTIFICATION_PORT ?? 3000); // NOSONAR
  console.info(`🚀 Notification service is running on port http://localhost:${process.env.NOTIFICATION_PORT ?? 3000}`); // NOSONAR
}

// Handle the bootstrap promise properly to avoid floating promises
bootstrap().catch((error) => {
  console.info('Application failed to start:', error);
  process.exit(1); // NOSONAR
});
