import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ 
      example: 'test@mail.com', 
      description: 'User email' 
    })
    @IsEmail()
    email!: string;

    @ApiProperty({ 
      example: 'pwd123', 
      description: 'User password' 
    })
    @IsString()
    password!: string;
}