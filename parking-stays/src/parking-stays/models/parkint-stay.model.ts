import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Vehicle } from './vehicle.model';

@Schema({ timestamps: true })
@ObjectType()
@Directive('@key(fields: "id")')
export class ParkingStay {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  licensePlate: string;

  @Field()
  @Prop({ required: true })
  entryDate: Date;

  @Field()
  @Prop({ required: true })
  exitDate: Date;

  @Field(() => Int)
  @Prop({ required: true })
  amount: number;

  @Field()
  @Prop({ required: true })
  location: string;

  @Prop()
  vehicleId?: string;

  @Field((type) => Vehicle)
  vehicle?: Vehicle;

  @Prop()
  userId?: string;

  @Prop()
  notFound?: Boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type ParkingStayDocument = HydratedDocument<ParkingStay>;
export const ParkingStaySchema = SchemaFactory.createForClass(ParkingStay);
