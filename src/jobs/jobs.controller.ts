import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateJobDto } from './dto/update-job.dto';
import type { User } from '../db/schema';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { NotesService } from '../notes/notes.service';
import { CreateNoteDto } from '../notes/dto/create-note.dto';
import { IsNotEmptyObjectPipe } from '../pipes/empty-body-validation.pipe';

@ApiTags('Jobs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly notesService: NotesService,
  ) {}

  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @Post()
  createJob(@CurrentUser() user: User, @Body() dto: CreateJobDto) {
    return this.jobsService.createJob(user.id, dto);
  }

  @ApiOperation({ summary: 'Get all jobs for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Jobs retrieved successfully' })
  @Get()
  findAll(@CurrentUser() user: User, @Query() query: GetJobsQueryDto) {
    return this.jobsService.findAll(user.id, query);
  }

  @ApiOperation({ summary: 'Get a specific job by ID' })
  @ApiResponse({ status: 200, description: 'Job retrieved successfully' })
  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') jobId: string) {
    return this.jobsService.findOne(user.id, jobId);
  }

  @ApiOperation({ summary: 'Update a specific job by ID' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @Patch(':id')
  updateJob(
    @CurrentUser() user: User,
    @Param('id') jobId: string,
    @Body(new IsNotEmptyObjectPipe()) dto: UpdateJobDto,
  ) {
    return this.jobsService.updateJob(user.id, jobId, dto);
  }

  @ApiOperation({ summary: 'Delete a specific job by ID' })
  @ApiResponse({ status: 200, description: 'Job deleted successfully' })
  @Delete(':id')
  deleteJob(@CurrentUser() user: User, @Param('id') jobId: string) {
    return this.jobsService.deleteJob(user.id, jobId);
  }

  @ApiOperation({ summary: 'Create a note for a specific job' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  @Post(':jobId/notes')
  createNote(
    @CurrentUser() user: User,
    @Param('jobId') jobId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.createNote(user.id, jobId, dto);
  }

  @ApiOperation({ summary: 'Get all notes for a specific job' })
  @ApiResponse({ status: 200, description: 'Notes retrieved successfully' })
  @Get(':jobId/notes')
  findJobNotes(@CurrentUser() user: User, @Param('jobId') jobId: string) {
    return this.notesService.findAll(user.id, jobId);
  }
}
