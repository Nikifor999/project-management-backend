import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { NoteModule } from 'src/note/note.module';
import { ProjectModule } from 'src/project/project.module';
import { SearchResolver } from './search.resolver';

@Module({
    imports: [NoteModule, ProjectModule],
    providers: [SearchService, SearchResolver],
})
export class SearchModule { }
