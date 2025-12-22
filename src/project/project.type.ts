import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.entity'; 
//import { NoteGraphQLType } from '../notes/dto/note.type'; 

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

  @Field()
  createdDate: Date;

  @Field()
  modifiedDate: Date;

  
//   @Field()
//   ownerName: string;

  // notes resolved  (from Mongo)
/*   @Field(() => [NoteGraphQLType], { nullable: 'itemsAndList' })
  notes?: any[]; */

  @Field(() => Number)
  noteCount?: number;
}
