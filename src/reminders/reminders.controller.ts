import {
  Controller,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { RemindersService } from './reminders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '../db/schema';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { IsNotEmptyObjectPipe } from '../pipes/empty-body-validation.pipe';

@ApiTags('Reminders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @ApiOperation({ summary: 'Get a specific reminder by ID' })
  @ApiResponse({ status: 200, description: 'Reminder retrieved successfully' })
  @Get(':reminderId')
  findOne(@CurrentUser() user: User, @Param('reminderId') reminderId: string) {
    return this.remindersService.findReminder(user.id, reminderId);
  }

  @ApiOperation({ summary: 'Update a specific reminder by ID' })
  @ApiResponse({ status: 200, description: 'Reminder updated successfully' })
  @Patch(':reminderId')
  updateReminder(
    @CurrentUser() user: User,
    @Param('reminderId') reminderId: string,
    @Body(new IsNotEmptyObjectPipe()) dto: UpdateReminderDto,
  ) {
    return this.remindersService.updateReminder(user.id, reminderId, dto);
  }

  @ApiOperation({ summary: 'Delete a specific reminder by ID' })
  @ApiResponse({ status: 200, description: 'Reminder deleted successfully' })
  @Delete(':reminderId')
  deleteReminder(
    @CurrentUser() user: User,
    @Param('reminderId') reminderId: string,
  ) {
    return this.remindersService.deleteReminder(user.id, reminderId);
  }
}
