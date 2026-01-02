import { createUnionType } from '@nestjs/graphql';
import { NoteGraphQLType } from 'src/note/dto/note.type';
import { ProjectType } from 'src/project/project.type';

export const SearchResultUnion = createUnionType({
    name: 'SearchResult',
    types: () => [ProjectType, NoteGraphQLType] as const,
    resolveType(value) {

        if ('title' in value && 'projectId' in value) {
            return NoteGraphQLType;
        }
        if ('name' in value) {
            return ProjectType;
        }
        return null;
    },
});