import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, NewJob } from '../db/schema';

@Injectable()
export class JobsService {
    constructor(
        @Inject(DRIZZLE) 
        private readonly db: NeonHttpDatabase<typeof schema>,
    ) {}

    async createJob(userId: string, dto: CreateJobDto): Promise<Job> {
        const newJob: NewJob = { userId, ...dto };

        const [job] = await this.db
        .insert(schema.jobs)
        .values(newJob)
        .returning();

        return job;
    }

    async findAll(userId: string): Promise<Job[]> {
        return this.db
        .select()
        .from(schema.jobs)
        .where(eq(schema.jobs.userId, userId));
    }

    async findOne(userId: string, jobId: string): Promise<Job> {
        const [job] = await this.db
        .select()
        .from(schema.jobs)
        .where(and(eq(schema.jobs.userId, userId), eq(schema.jobs.id, jobId)));

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    async updateJob(userId: string, jobId: string, dto: UpdateJobDto): Promise<Job> {
        const [job] = await this.db
        .update(schema.jobs)
        .set({...dto})
        .where(and(eq(schema.jobs.userId, userId), eq(schema.jobs.id, jobId)))
        .returning();

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    async deleteJob(userId: string, jobId: string): Promise<Job> {
        const [job] = await this.db
        .delete(schema.jobs)
        .where(and(eq(schema.jobs.userId, userId), eq(schema.jobs.id, jobId)))
        .returning();

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }
}
