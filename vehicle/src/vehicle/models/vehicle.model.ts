import { Directive, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.model';

export enum PaymentMethodType {
  CreditCard = 'credit-card',
  Tag = 'tag',
}

registerEnumType(PaymentMethodType, { name: 'PaymentMethodType' });

@Schema({ timestamps: true })
@ObjectType()
@Directive('@key(fields: "id")')
export class Vehicle {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  licensePlate: string;

  @Field(() => PaymentMethodType)
  @Prop({
    type: String,
    enum: {
      values: Object.values(PaymentMethodType),
      message: '{VALUE} is not supported',
    },
    required: true,
  })
  paymentMethod: PaymentMethodType;

  @Prop({ required: true })
  userId: string;

  @Field((type) => User)
  user?: User;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<Vehicle>;
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index({ licensePlate: 1 }, { unique: true });
