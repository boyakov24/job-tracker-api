import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [NotesModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
