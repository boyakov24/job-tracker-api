import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'newemail@example.com',
  })
  @IsEmail()
  email!: string;
}
