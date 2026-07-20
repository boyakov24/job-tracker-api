import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
    @ApiProperty({
        example: 'Prepare for the technical interview',
        description: 'Content of the note',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5000)
    content!: string;
}
