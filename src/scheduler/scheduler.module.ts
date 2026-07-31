import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ReminderScheduler } from './reminder.scheduler';
import { RemindersModule } from '../reminders/reminders.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [ScheduleModule.forRoot(), RemindersModule, MailModule],
  providers: [ReminderScheduler],
})
export class SchedulerModule {}
