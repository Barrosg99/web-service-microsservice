import {
  Args,
  Context,
  Query,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { Vehicle } from './models/vehicle.model';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { User } from './models/user.model';

@Resolver((of) => Vehicle)
export class VehicleResolver {
  constructor(private vehiclesService: VehicleService) {}

  @ResolveField((of) => User)
  user(@Parent() vehicle: Vehicle): any {
    return { __typename: 'User', id: vehicle.userId };
  }

  @Query((returns) => [Vehicle])
  async myVehicles(@Context('userId') userId: string) {
    if (!userId) throw new Error('You must be logged to execute this action.');

    return this.vehiclesService.findVehicles({ userId });
  }

  @Mutation((returns) => Vehicle)
  async createVehicle(
    @Args('createVehicleData') createVehicleData: CreateVehicleDto,
    @Context('userId') userId: string,
  ) {
    if (!userId) throw new Error('You must be logged to execute this action.');

    return this.vehiclesService.create({ ...createVehicleData, userId });
  }

  @Mutation((returns) => Vehicle)
  async updateVehicle(
    @Args('vehicleId') vehicleId: string,
    @Args('vehicleData') vehicleData: CreateVehicleDto,
    @Context('userId') userId: string,
  ) {
    if (!userId) throw new Error('You must be logged to execute this action.');

    return this.vehiclesService.edit({ ...vehicleData, userId }, vehicleId);
  }

  @Mutation((returns) => Vehicle)
  async deleteVehicle(
    @Args('vehicleId') vehicleId: string,
    @Context('userId') userId: string,
  ) {
    if (!userId) throw new Error('You must be logged to execute this action.');

    return this.vehiclesService.delete(vehicleId, userId);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): Promise<Vehicle> {
    return this.vehiclesService.findOne(reference.id);
  }
}
