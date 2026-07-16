import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
    if (!process.env.DIRECT_DATABASE_URL) {
        throw new Error('DIRECT_DATABASE_URL is not set in the .env file');
    }

    console.log('Starting migration...');

    const sql = neon(process.env.DIRECT_DATABASE_URL);
    const db = drizzle(sql);

    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();