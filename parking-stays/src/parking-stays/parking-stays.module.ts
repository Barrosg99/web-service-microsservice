import { Module } from '@nestjs/common';
import { ParkingStaysResolver } from './parking-stays.resolver';
import { ParkingStaysService } from './parking-stays.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingStay, ParkingStaySchema } from './models/parkint-stay.model';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: ParkingStay.name, schema: ParkingStaySchema },
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
  providers: [ParkingStaysResolver, ParkingStaysService],
})
export class ParkingStaysModule {}
