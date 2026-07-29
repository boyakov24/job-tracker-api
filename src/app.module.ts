import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { NotesModule } from './notes/notes.module';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    }), 
    HealthModule, DbModule, UsersModule, AuthModule, JobsModule, NotesModule, RemindersModule],
})
export class AppModule {}
