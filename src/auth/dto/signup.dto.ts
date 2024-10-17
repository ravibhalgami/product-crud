import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty() fullName: string;

    @IsEmail() email: string;

    @Matches(/^[0-9]{10}$/) phoneNumber: string;

    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password is too weak' })
    password: string;

    @IsNotEmpty() confirmPassword: string;
}