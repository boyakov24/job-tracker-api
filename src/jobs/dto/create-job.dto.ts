import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { statusEnum } from '../../db/schema';

export class CreateJobDto {
  @ApiProperty({ example: 'Google', description: 'Company name' })
  @IsString()
  company!: string;

  @ApiProperty({ example: 'Backend Developer', description: 'Job position' })
  @IsString()
  position!: string;

  @ApiProperty({ example: 'applied', description: 'Job status' })
  @IsEnum(statusEnum.enumValues)
  status!: typeof statusEnum.enumValues[number];

  @ApiProperty({ example: 'https://google.com/careers', description: 'Application URL' , required: false })
  @IsOptional()
  @IsUrl()
  applicationUrl?: string;
}
