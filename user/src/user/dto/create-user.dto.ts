import { Field, InputType } from "@nestjs/graphql";
import { UserDocType } from "../models/user.model";

@InputType()
export class CreateUserDto {
  @Field()
  readonly name: string;

  @Field()
  readonly email: string;

  @Field()
  readonly doc: string;

  @Field()
  readonly docType: UserDocType;
  
  @Field()
  password: string;
}
