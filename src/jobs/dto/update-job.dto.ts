import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { statusEnum, type JobStatus } from '../../db/schema';

export class UpdateJobDto {
  @ApiPropertyOptional({ 
    example: 'Google', 
    description: 'Company name' 
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ 
    example: 'Backend Developer', 
    description: 'Job position' 
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ 
    example: 'interview', 
    description: 'Job status' 
  })
  @IsOptional()
  @IsEnum(statusEnum.enumValues)
  status?: JobStatus;

  @ApiPropertyOptional({ 
    example: 'https://google.com/careers', 
    description: 'Application URL' 
  })
  @IsOptional()
  @IsUrl()
  applicationUrl?: string;
}