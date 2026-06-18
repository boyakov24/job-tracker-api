import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { DRIZZLE } from '../db/db.module';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DRIZZLE)
        private readonly db: any,
    ) {}

    async findByEmail(email: string) {
        const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));
        
        return user;
    }

    async createUser(email: string, password: string) {
        const [user] = await this.db
        .insert(users)
        .values({ email, password })
        .returning();

        return user;
    }
}