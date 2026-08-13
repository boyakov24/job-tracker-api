import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
import { IsOptional, IsUrl, ValidateIf } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @ValidateIf((_, value) => value !== '')
  @IsOptional()
  @IsUrl()
  applicationUrl?: string;
}
