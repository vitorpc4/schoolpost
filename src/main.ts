import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './env';
import {createDatabase} from "typeorm-extension";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT);
}
bootstrap();
