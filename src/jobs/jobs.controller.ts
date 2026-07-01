import { Controller, Body, Post, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';

import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createJob(@CurrentUser() user: any, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any) {
    return this.jobsService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: any, @Param('id') jobId: string) {
    return this.jobsService.findOne(user.id, jobId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateJob(
    @CurrentUser() user: any,
    @Param('id') jobId: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.updateJob(user.id, jobId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteJob(@CurrentUser() user: any, @Param('id') jobId: string) {
    return this.jobsService.deleteJob(user.id, jobId);
  }
}
