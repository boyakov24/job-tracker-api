import { pgTable, pgEnum, uuid, varchar, timestamp, index } from 'drizzle-orm/pg-core';

const timestamps = {
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
};

export const statusEnum = pgEnum('status', ['applied', 'interview', 'offer', 'rejected']);

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    ...timestamps
});

export const jobs = pgTable('jobs', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    company: varchar('company', { length: 255 }).notNull(),
    position: varchar('position', { length: 255 }).notNull(),
    status: statusEnum('status').default('applied').notNull(),
    applicationUrl: varchar('application_url', { length: 1024 }),
    ...timestamps
}, (table) => [
  index('jobs_user_id_idx').on(table.userId),
]);