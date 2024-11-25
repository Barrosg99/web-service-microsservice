import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Directive, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum UserDocType {
  CPF = 'cpf',
  RG = 'rg',
}

registerEnumType(UserDocType, { name: 'UserDocType' });

@Schema({ timestamps: true })
@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field()
  @Prop({ required: true })
  doc: string;

  @Field(() => UserDocType)
  @Prop({
    type: String,
    enum: {
      values: Object.values(UserDocType),
      message: '{VALUE} is not supported',
    },
    required: true,
  })
  docType: UserDocType;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ doc: 1, docType: 1 }, { unique: true });
