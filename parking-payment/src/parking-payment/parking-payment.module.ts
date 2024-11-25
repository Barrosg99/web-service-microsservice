import { Module } from '@nestjs/common';
import { ParkingPaymentResolver } from './parking-payment.resolver';
import { ParkingPaymentService } from './parking-payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import {
  ParkingPayment,
  ParkingPaymentSchema,
} from './models/parking-payment.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: ParkingPayment.name, schema: ParkingPaymentSchema },
    ]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri:
            configService.get('RABBITMQ_URI') ||
            `amqp://${configService.get('RABBITMQ_USER')}:${configService.get(
              'RABBITMQ_PASSWORD',
            )}@${configService.get('RABBITMQ_HOST')}:${configService.get(
              'RABBITMQ_PORT',
            )}`,
          connectionInitOptions: { wait: false },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [ParkingPaymentResolver, ParkingPaymentService],
})
export class ParkingPaymentModule {}
