import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { NoteService } from 'src/note/note.service';
import { ProjectService } from 'src/project/project.service';
import type { Cache } from 'cache-manager';

@Injectable()
export class SearchService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly noteService: NoteService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async globalSearch(userId: string, query: string): Promise<any[] | string[]> {
    const cacheKey = `search:${userId}:${query.trim().toLowerCase()}`;
    console.log(`Checking cache for key: ${cacheKey}`);

    const cachedResult = await this.cacheManager.get<any[]>(cacheKey);

    if (cachedResult) {
      console.log(`Cache hit for: ${query}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return cachedResult;
    }

    console.log(`Cache MISS - going to DB`);
    // await new Promise(resolve => setTimeout(resolve, 10000));

    const [projects, notes] = await Promise.all([
      this.projectService.searchProjects(userId, query),
      this.noteService.searchNotes(userId, query),
    ]);

    const result = [...projects, ...notes];

    if (result.length > 0) {
      console.log(`Saving to Redis`);
      await this.cacheManager.set(cacheKey, result, 2 * 60 * 10000);
    }
    return result;
  }
}
