import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { NotesService } from './notes.service';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { User } from '../db/schema';

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get(':noteId')
  findOne(@CurrentUser() user: User, @Param('noteId') noteId: string) {
    return this.notesService.findOne(user.id, noteId);
  }
  
  @Patch(':noteId')
  update(@CurrentUser() user: User, @Param('noteId') noteId: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.updateNote(user.id, noteId, dto);
  }
  
  @Delete(':noteId')
  remove(@CurrentUser() user: User, @Param('noteId') noteId: string) {
    return this.notesService.deleteNote(user.id, noteId);
  }
}
