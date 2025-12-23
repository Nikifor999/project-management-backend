import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectResolver } from './project.resolver';
import { User } from 'src/user/user.entity';
import { NoteModule } from 'src/note/note.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    forwardRef(() => NoteModule),
  ],
  providers: [ProjectService, ProjectResolver],
  exports: [ProjectService],
})
export class ProjectModule { }
