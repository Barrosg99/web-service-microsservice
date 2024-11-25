import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { ParkingMessage } from './dto/create-parking-stay.dto';
import { ParkingStaysService } from './parking-stays.service';
import { Vehicle } from './models/vehicle.model';
import { ParkingStay } from './models/parkint-stay.model';

@Resolver((of) => ParkingStay)
export class ParkingStaysResolver {
  constructor(private parkingStayService: ParkingStaysService) {}

  @ResolveField((of) => Vehicle)
  vehicle(@Parent() parkingStay: ParkingStay): any {
    return { __typename: 'Vehicle', id: parkingStay.vehicleId };
  }

  @Query((returns) => [ParkingStay])
  myParkingStays(@Context('userId') userId: string) {
    return this.parkingStayService.find({ userId });
  }

  @Mutation((returns) => Boolean)
  async postParkingStayMessage(@Args('message') msg: ParkingMessage) {
    return await this.parkingStayService.postMessageParkingStayQueue(msg);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<ParkingStay> {
    return this.parkingStayService.findOne(reference.id);
  }
}
