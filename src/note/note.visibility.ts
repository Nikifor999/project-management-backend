import { registerEnumType } from "@nestjs/graphql";

export enum NoteVisibility {
  PRIVATE = 'private',
  SHARED = 'shared',
  PUBLIC = 'public',
}

registerEnumType(NoteVisibility, {
  name: 'NoteVisibility', // Это имя будет использоваться в схеме GraphQL
  description: 'The visibility status of the note', 
});