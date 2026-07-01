import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

import { statusEnum } from '../../db/schema';

export class CreateJobDto {
  @IsString()
  company!: string;

  @IsString()
  position!: string;

  @IsEnum(statusEnum.enumValues)
  status!: typeof statusEnum.enumValues[number];

  @IsOptional()
  @IsUrl()
  applicationUrl?: string;
}
