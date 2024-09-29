import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';

import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SchoolPosts API')
    .setDescription('API para criação de posts')
    .setVersion('1.0')
    .addTag('Post')
    .addTag('UserSchoolAssociation')
    .addTag('User')
    .addTag('School')
    .addTag('Auth')
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(env.PORT);
}
bootstrap();
