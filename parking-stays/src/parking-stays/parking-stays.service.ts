import {
  AmqpConnection,
  RabbitRPC,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ParkingMessage } from './dto/create-parking-stay.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ParkingStay } from './models/parkint-stay.model';
import { Model } from 'mongoose';

@Injectable()
export class ParkingStaysService {
  constructor(
    @InjectModel(ParkingStay.name) private parkingStayModel: Model<ParkingStay>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: '',
    routingKey: 'parking.stay.queue',
    queue: 'parking.stay.queue',
  })
  public async processParkingStay(msg: ParkingMessage) {
    const response = await this.amqpConnection.request<any>({
      exchange: '',
      routingKey: 'vehicle.queue',
      payload: { licensePlate: msg.licensePlate },
    });

    const { userId, vehicleId, paymentMethod, notFound } = response;

    let parkingStayData;

    if (notFound) {
      parkingStayData = { ...msg, notFound };
    } else {
      parkingStayData = { ...msg, vehicleId, userId };

      const parkingStay = await this.parkingStayModel.create(parkingStayData);

      const paymentMessage = {
        userId,
        parkingStaysId: parkingStay.id,
        paymentMethod,
      };

      await this.amqpConnection.publish(
        '',
        'parking.payment.queue',
        paymentMessage,
      );
    }
  }

  async postMessageParkingStayQueue(payload: ParkingMessage): Promise<Boolean> {
    return await this.amqpConnection.publish('', 'parking.stay.queue', payload);
  }

  async find(params): Promise<ParkingStay[]> {
    return await this.parkingStayModel.find(params);
  }

  async findOne(id: string): Promise<ParkingStay> {
    return this.parkingStayModel.findById(id);
  }
}
