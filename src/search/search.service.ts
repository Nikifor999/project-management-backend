import { Injectable } from '@nestjs/common';
import { NoteService } from 'src/note/note.service';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class SearchService {

    constructor(
        private readonly projectService: ProjectService,
        private readonly noteService: NoteService
    ) { }


    async globalSearch(userId: string, query: string) {

        const [projects, notes] = await Promise.all([
            this.projectService.searchProjects(userId, query),
            this.noteService.searchNotes(userId, query)
        ]);

        return [...projects, ...notes];
    }

}
