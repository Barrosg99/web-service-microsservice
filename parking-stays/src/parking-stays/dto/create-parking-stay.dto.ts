import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ParkingMessage {
  @Field()
  readonly licensePlate: string;

  @Field()
  readonly entryDate: Date;

  @Field()
  readonly exitDate: Date;

  @Field(() => Int)
  readonly amount: number;

  @Field()
  location: string;
}
