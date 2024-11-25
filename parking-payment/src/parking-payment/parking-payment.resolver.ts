import {
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ParkingPayment } from './models/parking-payment.model';
import { ParkingPaymentService } from './parking-payment.service';
import { ParkingStay } from './models/parking-stay.model';

@Resolver((of) => ParkingPayment)
export class ParkingPaymentResolver {
  constructor(private parkingPaymentService: ParkingPaymentService) {}

  @ResolveField((of) => ParkingStay)
  parkingStay(@Parent() parkingPayment: ParkingPayment): any {
    return { __typename: 'ParkingStay', id: parkingPayment.parkingStaysId };
  }

  @Query((returns) => [ParkingPayment])
  myPayments(@Context('userId') userId: string): Promise<ParkingPayment[]> {
    return this.parkingPaymentService.find({ userId });
  }
}
