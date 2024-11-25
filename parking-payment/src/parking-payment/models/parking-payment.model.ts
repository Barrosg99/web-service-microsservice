import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ParkingStay } from './parking-stay.model';

export enum PaymentMethodType {
  CreditCard = 'credit-card',
  Tag = 'tag',
}

export enum ParkingPaymentStatus {
  Paid = 'paid',
  Failed = 'failed',
}

registerEnumType(PaymentMethodType, { name: 'PaymentMethodType' });
registerEnumType(ParkingPaymentStatus, { name: 'ParkingPaymentStatus' });

@Schema({ timestamps: true })
@ObjectType()
export class ParkingPayment {
  @Field(() => ID)
  id: string;

  @Field(() => ParkingPaymentStatus)
  @Prop({
    type: String,
    enum: {
      values: Object.values(ParkingPaymentStatus),
      message: '{VALUE} is not supported',
    },
    required: true,
  })
  status: ParkingPaymentStatus;

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
  parkingStaysId: string;

  @Field((type) => ParkingStay)
  parkingStay?: ParkingStay;

  @Prop({ required: true })
  userId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export type ParkingPaymentDocument = HydratedDocument<ParkingPayment>;
export const ParkingPaymentSchema =
  SchemaFactory.createForClass(ParkingPayment);
