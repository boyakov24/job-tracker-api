import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, and, isNull, lte } from 'drizzle-orm';

import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder, NewReminder } from '../db/schema';
import { PendingReminder } from './types/pending-reminder.type';

@Injectable()
export class RemindersService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  // prettier-ignore
  async createReminder(userId: string, noteId: string, dto: CreateReminderDto): Promise<Reminder> {
    const newReminder: NewReminder = {
      noteId,
      remindAt: new Date(dto.remindAt),
    };
    await this.ensureUserNote(userId, noteId);

    const [reminder] = await this.db
      .insert(schema.reminders)
      .values(newReminder)
      .returning();

    return reminder;
  }

  async findByNoteId(userId: string, noteId: string): Promise<Reminder> {
    await this.ensureUserNote(userId, noteId);

    const [reminder] = await this.db
      .select()
      .from(schema.reminders)
      .where(eq(schema.reminders.noteId, noteId))
      .limit(1);

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    return reminder;
  }

  async findReminder(userId: string, reminderId: string): Promise<Reminder> {
    return await this.ensureUserReminder(userId, reminderId);
  }

  async updateReminder(
    userId: string,
    reminderId: string,
    dto: UpdateReminderDto,
  ): Promise<Reminder> {
    await this.ensureUserReminder(userId, reminderId);

    const updateData: Partial<NewReminder> = {};

    if (dto.remindAt) {
      updateData.remindAt = new Date(dto.remindAt);
    }

    const [reminder] = await this.db
      .update(schema.reminders)
      .set(updateData)
      .where(eq(schema.reminders.id, reminderId))
      .returning();

    return reminder;
  }

  async deleteReminder(userId: string, reminderId: string): Promise<Reminder> {
    await this.ensureUserReminder(userId, reminderId);

    const [reminder] = await this.db
      .delete(schema.reminders)
      .where(eq(schema.reminders.id, reminderId))
      .returning();

    return reminder;
  }

  private async ensureUserNote(userId: string, noteId: string) {
    const [result] = await this.db
      .select({ note: schema.notes })
      .from(schema.notes)
      .innerJoin(schema.jobs, eq(schema.notes.jobId, schema.jobs.id))
      .where(and(eq(schema.notes.id, noteId), eq(schema.jobs.userId, userId)));

    if (!result) {
      throw new NotFoundException('Note not found');
    }

    return result.note;
  }

  private async ensureUserReminder(userId: string, reminderId: string) {
    const [result] = await this.db
      .select({ reminders: schema.reminders })
      .from(schema.reminders)
      .innerJoin(schema.notes, eq(schema.reminders.noteId, schema.notes.id))
      .innerJoin(schema.jobs, eq(schema.notes.jobId, schema.jobs.id))
      .where(
        and(
          eq(schema.reminders.id, reminderId),
          eq(schema.jobs.userId, userId),
        ),
      );

    if (!result) {
      throw new NotFoundException('Reminder not found');
    }

    return result.reminders;
  }

  async findPendingReminders(): Promise<PendingReminder[]> {
    const now = new Date();

    return await this.db
      .select({
        reminderId: schema.reminders.id,
        email: schema.users.email,
        company: schema.jobs.company,
        position: schema.jobs.position,
        note: schema.notes.content,
      })
      .from(schema.reminders)
      .innerJoin(schema.notes, eq(schema.reminders.noteId, schema.notes.id))
      .innerJoin(schema.jobs, eq(schema.notes.jobId, schema.jobs.id))
      .innerJoin(schema.users, eq(schema.jobs.userId, schema.users.id))
      .where(
        and(
          isNull(schema.reminders.sentAt),
          lte(schema.reminders.remindAt, now),
        ),
      );
  }

  async markAsSent(reminderId: string): Promise<void> {
    await this.db
      .update(schema.reminders)
      .set({
        sentAt: new Date(),
      })
      .where(eq(schema.reminders.id, reminderId));
  }
}
