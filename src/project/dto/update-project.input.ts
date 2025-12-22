import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateProjectInput {
  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}
