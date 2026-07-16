import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and, count, asc, desc } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

import { DRIZZLE } from '../db/db.module';
import * as schema from '../db/schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, NewJob } from '../db/schema';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { PaginatedJobsResponse } from './types/paginated-jobs-response.type';

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

    async findAll(userId: string, query: GetJobsQueryDto): Promise<PaginatedJobsResponse> {
        const { page = 1, limit = 10 } = query;
        const offset = (page - 1) * limit;

        const conditions = [eq(schema.jobs.userId, userId)];

        if (query.status) {
            conditions.push(eq(schema.jobs.status, query.status));
        }

        const sortColumn = {
            createdAt: schema.jobs.createdAt,
            company: schema.jobs.company,
            position: schema.jobs.position,
            status: schema.jobs.status,
        } [query.sortBy ?? 'createdAt'];

        const orderBy = query.order === 'asc' ? asc(sortColumn) : desc(sortColumn);

        const [totalResult] = await this.db
                .select({ count: count() })
                .from(schema.jobs)
                .where(and(...conditions));

        const total = totalResult?.count ?? 0;

        if (total === 0) {
            return { data: [], total: 0, page, limit, totalPages: 0 };
        }

        const jobs = await this.db
            .select()
            .from(schema.jobs)
            .where(and(...conditions))
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset);

        const totalPages = Math.ceil(total / limit);
        
        return {
            data: jobs,
            total,
            page,
            limit,
            totalPages,
        };
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
