import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RemindersService } from '../reminders/reminders.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ReminderScheduler {
  private readonly logger = new Logger(ReminderScheduler.name);

  constructor(
    private readonly remindersService: RemindersService,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleReminderCron() {
    const reminders = await this.remindersService.findPendingReminders();

    if (reminders.length === 0) {
      this.logger.debug('No reminders to send');
      return;
    }

    for (const reminder of reminders) {
      try {
        await this.mailService.sendReminder({
          to: reminder.email,
          company: reminder.company,
          position: reminder.position,
          note: reminder.note,
        });

        await this.remindersService.markAsSent(reminder.reminderId);

        this.logger.log(`Reminder ${reminder.reminderId} sent`);
      } catch (error) {
        this.logger.error(
          `Failed to send reminder ${reminder.reminderId}`,
          error instanceof Error ? error.stack : undefined,
        );
      }
    }
  }
}
