import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/user.entity";

@ObjectType()
export class ChangePasswordResponse {
    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}