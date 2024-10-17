import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, LoginDto } from './dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() signUpDto:SignUpDto) {
        return this.authService.signup(signUpDto);
    }

    @Post('login')
    async login(@Body() loginDto : LoginDto) {
        return this.authService.login(loginDto);
    }
}
