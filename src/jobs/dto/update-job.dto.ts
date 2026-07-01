import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

import { statusEnum } from '../../db/schema';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(statusEnum.enumValues)
  status?: typeof statusEnum.enumValues[number];

  @IsOptional()
  @IsUrl()
  applicationUrl?: string;
}