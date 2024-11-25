import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Vehicle } from './models/vehicle.model';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}

  @RabbitRPC({
    exchange: '',
    routingKey: 'vehicle.queue',
    queue: 'vehicle.queue',
  })
  public async fillParkingStayMsg(msg) {
    if (!msg || !msg.licensePlate) throw new Error('Wrong Format');

    const vehicle = await this.vehicleModel.findOne({
      licensePlate: msg.licensePlate,
    });

    if (!vehicle) return { notFound: true };

    return {
      vehicleId: vehicle.id,
      userId: vehicle.userId,
      paymentMethod: vehicle.paymentMethod,
    };
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const createdVehicle = await this.vehicleModel.create(createVehicleDto);
    return createdVehicle;
  }

  async edit(
    createVehicleDto: CreateVehicleDto,
    vehicleId: string,
  ): Promise<Vehicle> {
    const updatedVehicle = await this.vehicleModel.findOneAndUpdate(
      { _id: vehicleId },
      { $set: { ...createVehicleDto } },
      { new: true },
    );

    if (!updatedVehicle) throw new Error('Vehicle not found.');

    return updatedVehicle;
  }

  async findVehicles(params): Promise<Vehicle[]> {
    const createdVehicle = await this.vehicleModel.find(params);
    return createdVehicle;
  }

  async findOne(id: string): Promise<Vehicle> {
    return this.vehicleModel.findById(id);
  }

  async delete(vehicleId: string, userId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findOne({ _id: vehicleId, userId });

    if (!vehicle) throw new Error('Vehicle not found.');

    await vehicle.deleteOne();

    return vehicle;
  }
}
