import { IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReminderDto {
    @ApiProperty({
        example: '2023-10-10T10:00:00Z',
        description: 'The date and time to remind the user'
    })
    @IsNotEmpty()
    @IsDateString()
    remindAt!: string;
}