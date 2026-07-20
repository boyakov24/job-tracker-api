import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { Note, NewNote } from '../db/schema';

@Injectable()
export class NotesService {
    constructor(
      @Inject(DRIZZLE) private readonly db: NeonHttpDatabase
    ) {}

    async createNote(userId: string, jobId: string, dto: CreateNoteDto): Promise<Note> {
        const newNote: NewNote = { jobId, ...dto };
        await this.ensureUserJob(userId, jobId);

        const [note] = await this.db
        .insert(schema.notes)
        .values(newNote)
        .returning();

        return note;
    }

    async findAll(userId: string, jobId: string): Promise<Note[]> {
        await this.ensureUserJob(userId, jobId);

        return this.db
        .select()
        .from(schema.notes)
        .where(eq(schema.notes.jobId, jobId));
    }

    async findOne(userId: string, noteId: string): Promise<Note> {
        return this.ensureUserNote(userId, noteId);
    }

    async updateNote(userId: string, noteId: string, dto: UpdateNoteDto): Promise<Note> {
        await this.ensureUserNote(userId, noteId);

        const [note] = await this.db
        .update(schema.notes)
        .set(dto)
        .where(eq(schema.notes.id, noteId))
        .returning();

        return note;
    }

    async deleteNote(userId: string, noteId: string): Promise<Note> {
        await this.ensureUserNote(userId, noteId);

        const [note] = await this.db
        .delete(schema.notes)
        .where(eq(schema.notes.id, noteId))
        .returning();

        return note;
    }

    private async ensureUserJob(userId: string, jobId: string) {
        const [job] = await this.db
        .select()
        .from(schema.jobs)
        .where(and(eq(schema.jobs.id, jobId), eq(schema.jobs.userId, userId)));

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    private async ensureUserNote(userId: string, noteId: string) {
        const [result] = await this.db
        .select({note: schema.notes})
        .from(schema.notes)
        .innerJoin(schema.jobs, eq(schema.notes.jobId, schema.jobs.id))
        .where(and(eq(schema.notes.id, noteId), eq(schema.jobs.userId, userId)));

        if (!result) {
            throw new NotFoundException('Note not found');
        }

        return result.note;
    }
}
