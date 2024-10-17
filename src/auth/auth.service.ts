import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto, LoginDto } from './dto';
import { User } from 'src/users/models/user.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService : UsersService,
        private jwtService : JwtService,
        private configService : ConfigService
    ) {}

    async signup(signUpDto : SignUpDto) : Promise<User> {
        const { email, password, confirmPassword } = signUpDto;
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        if (password !== confirmPassword) {
            throw new ConflictException('Passwords do not match');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return this.userService.createUser({
            ...signUpDto,
            password : hashedPassword
        });
    }

    async login(loginDto:LoginDto) : Promise<{accessToken : string}> {
        const { email, password } = loginDto;
        const user = await this.userService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('Your account is inactive, please contact admin');
        }
        const payload = {email : user.email, userId : user._id, role : user.role};
        const jwtOptions = { expiresIn: this.configService.get<string>('JWT_EXPIRED_TIME') }
        return { accessToken : this.jwtService.sign(payload, jwtOptions)};
        
    }
}
