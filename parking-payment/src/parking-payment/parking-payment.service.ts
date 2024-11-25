import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ParkingPayment } from './models/parking-payment.model';
import { Model } from 'mongoose';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ParkingPaymentService {
  constructor(
    @InjectModel(ParkingPayment.name)
    private parkingPaymentModel: Model<ParkingPayment>,
  ) {}

  @RabbitSubscribe({
    exchange: '',
    routingKey: 'parking.payment.queue',
    queue: 'parking.payment.queue',
  })
  public async processPayment(msg) {
    const statuses = ['failed', 'paid'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    const randomStatus = statuses[randomIndex];

    await this.parkingPaymentModel.create({ ...msg, status: randomStatus });
  }

  public async find(params): Promise<ParkingPayment[]> {
    return this.parkingPaymentModel.find(params)
  }
}
