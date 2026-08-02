import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'currentPassword123',
  })
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: 'newPassword456',
  })
  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;
}
