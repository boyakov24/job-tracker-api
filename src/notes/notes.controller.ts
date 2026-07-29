import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { NotesService } from './notes.service';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from '../db/schema';
import { RemindersService } from '../reminders/reminders.service';
import { CreateReminderDto } from '../reminders/dto/create-reminder.dto';
import { IsNotEmptyObjectPipe } from '../pipes/empty-body-validation.pipe';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly remindersService: RemindersService,
  ) {}

  @Get(':noteId')
  findOne(@CurrentUser() user: User, @Param('noteId') noteId: string) {
    return this.notesService.findOne(user.id, noteId);
  }

  @Patch(':noteId')
  update(
    @CurrentUser() user: User,
    @Param('noteId') noteId: string,
    @Body(new IsNotEmptyObjectPipe()) dto: UpdateNoteDto,
  ) {
    return this.notesService.updateNote(user.id, noteId, dto);
  }

  @Delete(':noteId')
  remove(@CurrentUser() user: User, @Param('noteId') noteId: string) {
    return this.notesService.deleteNote(user.id, noteId);
  }

  @Post(':noteId/reminders')
  createReminder(
    @CurrentUser() user: User,
    @Param('noteId') noteId: string,
    @Body() dto: CreateReminderDto,
  ) {
    return this.remindersService.createReminder(user.id, noteId, dto);
  }

  @Get(':noteId/reminders')
  findJobReminders(@CurrentUser() user: User, @Param('noteId') noteId: string) {
    return this.remindersService.findByNoteId(user.id, noteId);
  }
}
