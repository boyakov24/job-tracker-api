import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';

import { DRIZZLE } from '../db/db.module';
import { jobs } from '../db/schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
    constructor(
        @Inject(DRIZZLE) 
        private readonly db: any,
    ) {}

    async createJob(userId: string, dto: CreateJobDto) {
        const [job] = await this.db
        .insert(jobs)
        .values({ userId, ...dto })
        .returning();

        return job;
    }

    async findAll(userId: string) {
        return this.db
        .select()
        .from(jobs)
        .where(eq(jobs.userId, userId));
    }

    async findOne(userId: string, jobId: string) {
        const [job] = await this.db
        .select()
        .from(jobs)
        .where(and(eq(jobs.userId, userId), eq(jobs.id, jobId)));

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    async updateJob(userId: string, jobId: string, dto: UpdateJobDto) {
        const [job] = await this.db
        .update(jobs)
        .set({...dto})
        .where(and(eq(jobs.userId, userId), eq(jobs.id, jobId)))
        .returning();

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }

    async deleteJob(userId: string, jobId: string) {
        const [job] = await this.db
        .delete(jobs)
        .where(and(eq(jobs.userId, userId), eq(jobs.id, jobId)))
        .returning();

        if (!job) {
            throw new NotFoundException('Job not found');
        }

        return job;
    }
}
