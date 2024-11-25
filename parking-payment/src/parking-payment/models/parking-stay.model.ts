import { Directive, ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class ParkingStay {
  @Field((type) => ID)
  @Directive('@external')
  id: string;
}
