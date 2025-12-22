import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";



@ObjectType()
export class AuthResponse {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;

   /*  @Field(() => User, { nullable: true })
    user?: User; */
}