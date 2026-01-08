import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.entity'; 
import { NoteGraphQLType } from 'src/note/dto/note.type';

@ObjectType('Project')
export class ProjectType {

  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  isArchive: boolean;

  @Field(() => Date)
  createdDate: Date;

  @Field(() => Date)
  modifiedDate: Date;
  
  @Field()
  ownerName: string;

  // notes из Mongo
  @Field(() => [NoteGraphQLType], { nullable: 'itemsAndList' })
  notes?: NoteGraphQLType[];

  @Field(() => Number)
  noteCount?: number;
}
