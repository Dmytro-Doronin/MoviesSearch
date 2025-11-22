import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { mainAppSettings } from './settings/main-app-settings';
async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    mainAppSettings(app);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
