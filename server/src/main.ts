import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
