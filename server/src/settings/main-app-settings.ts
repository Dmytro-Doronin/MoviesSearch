import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

import { AppModule } from '../app.module';
import { FieldError } from '../types/settings.type';
export const mainAppSettings = (app: INestApplication) => {
    app.use(cookieParser());

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            stopAtFirstError: true,
            exceptionFactory: (errors) => {
                const errorsForResponse: FieldError[] = [];
                errors.forEach((err) => {
                    const keys = Object.keys(err.constraints!);
                    keys.forEach((k) => {
                        errorsForResponse.push({
                            message: err.constraints![k],
                            field: err.property,
                        });
                    });
                });
                throw new BadRequestException(errorsForResponse);
            },
        }),
    );
};
