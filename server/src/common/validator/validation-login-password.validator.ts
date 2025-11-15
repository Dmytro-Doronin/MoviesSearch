import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { UserQueryRepository } from '../../features/user/repositories/user-query.repository';

//registration in IoC
@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private userQueryRepository: UserQueryRepository) {}

    async validate(userName: string) {
        const userEmail = await this.userQueryRepository.getUserByLogin(userName);

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
