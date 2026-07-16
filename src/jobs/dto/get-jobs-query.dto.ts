import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, Min, IsIn, IsString, IsEnum } from "class-validator";
import { Type } from "class-transformer";

import { statusEnum, type JobStatus } from "../../db/schema";

export class GetJobsQueryDto {
  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Page number'
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    example: 10, 
    description: 'Items per page' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Sort field'
  })
  @IsOptional()
  @IsString()
  @IsIn([ 'createdAt',, 'company', 'position', 'status' ])
  sortBy?: 'createdAt' | 'company' | 'position' | 'status' = 'createdAt';

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort order',
    default: 'desc'
  })
  @IsOptional()
  @IsIn([ 'asc', 'desc' ])
  order?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    enum: statusEnum.enumValues,
    example: 'interview',
    description: 'Filter jobs by status'
  })
  @IsOptional()
  @IsEnum(statusEnum.enumValues)
  status?: JobStatus;
}