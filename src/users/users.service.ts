import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

import * as schema from '../db/schema';
import { DRIZZLE } from '../db/db.module';
import { User, NewUser } from '../db/schema';

@Injectable()
export class UsersService {
    constructor(
        @Inject(DRIZZLE)
        private readonly db: NeonHttpDatabase<typeof schema>,
    ) {}

    async findByEmail(email: string): Promise<User | undefined> {
        const [user] = await this.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email));
        
        return user;
    }

    async createUser(email: string, password: string): Promise<User> {
        const newUser: NewUser = { email, password };
        
        const [user] = await this.db
        .insert(schema.users)
        .values(newUser)
        .returning();

        return user;
    }
}