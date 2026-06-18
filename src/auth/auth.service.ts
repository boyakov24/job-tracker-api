import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email is already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.createUser(
            dto.email,
            hashedPassword,
        );

        const payload = { sub: user.id, email: user.email };

        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken, };
    }
}
