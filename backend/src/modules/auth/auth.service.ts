import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { IUser } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(email: string, password: string): Promise<IUser> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.usersService.create(email, hashedPassword);
    }

    async login(email: string, password: string): Promise<{access_token:string}> {
        const user = await this.usersService.findOneByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id };
        return {access_token: this.jwtService.sign(payload)};
    }
}
