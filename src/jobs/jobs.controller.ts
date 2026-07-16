import { Controller, Body, Post, UseGuards, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateJobDto } from './dto/update-job.dto';
import type { User } from '../db/schema';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createJob(@CurrentUser() user: User, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User, @Query() query: GetJobsQueryDto) {
    return this.jobsService.findAll(user.id, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@CurrentUser() user: User, @Param('id') jobId: string) {
    return this.jobsService.findOne(user.id, jobId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateJob(
    @CurrentUser() user: User, @Param('id') jobId: string, @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.updateJob(user.id, jobId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteJob(@CurrentUser() user: User, @Param('id') jobId: string) {
    return this.jobsService.deleteJob(user.id, jobId);
  }
}
