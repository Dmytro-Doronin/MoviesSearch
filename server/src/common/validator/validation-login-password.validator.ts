import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { UserQueryRepository } from '../../features/user/repositories/userQuery.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private userQueryRepository: UserQueryRepository) {}

    async validate(email: string) {
        const userEmail = await this.userQueryRepository.findByEmail(email);

        return !userEmail;
    }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUserAlreadyExistConstraint,
        });
    };
}
