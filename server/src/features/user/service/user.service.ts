import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../../../prisma/service/prisma.service';
import { CreateUserDto } from '../models/create-user.dto';
@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async createUser({
        login,
        password,
        email,
        imageUrl,
    }: CreateUserDto & { imageUrl: string | null }) {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        try {
            return await this.prismaService.user.create({
                data: {
                    login,
                    email,
                    passwordHash,
                    passwordSalt,
                    imageUrl,
                    role: 'user',
                },
            });
        } catch (e) {
            if (e.code === 'P2002') {
                throw new BadRequestException('User with this email already exists');
            }

            throw new InternalServerErrorException('Failed to create user');
        }
    }
}
