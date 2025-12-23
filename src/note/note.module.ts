import { forwardRef, Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './note.schema';
import { NoteResolver } from './note.resolver';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    forwardRef(() => ProjectModule),
  ],
  providers: [NoteService, NoteResolver],
  exports: [NoteService],
})
export class NoteModule { }
