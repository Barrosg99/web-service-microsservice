import { Module } from '@nestjs/common';
import { ParkingStaysModule } from './parking-stays/parking-stays.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { HealthController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoUser = configService.get<string>('MONGO_USERNAME');
        const mongoPassword = configService.get<string>('MONGO_PASSWORD');
        const mongoHost = configService.get<string>('MONGO_HOST');
        const mongoPort = configService.get<string>('MONGO_PORT');
        const mongoDB = configService.get<string>('MONGO_DB');

        return {
          uri:
            configService.get<string>('MONGO_URI') ||
            `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDB}?authSource=admin`,
        };
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      context: ({ req }) => {
        const userId = req.headers['user-id'];
        if (userId) return { userId };
      },
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    ParkingStaysModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
