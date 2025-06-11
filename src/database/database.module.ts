import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { envConfig } from '../config/env.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [envConfig.KEY],
      useFactory: (configService: ConfigType<typeof envConfig>) => {
        const { uri } = configService.database;
        return {
          uri,
          connectionFactory: (connection: Connection) => {
            connection.on('error', (e: Error) => {
              console.warn('MongoDB connection error', e);
            });
            connection.on('disconnected', () => {
              console.warn('MongoDB disconnected');
            });
            connection.on('connected', () => {
              console.log('MongoDB connected successfully');
            });
            return connection;
          },
          // Configuración para que la aplicación no se bloquee si MongoDB no está disponible
          connectionErrorFactory: (error: Error) => {
            console.error(`MongoDB connection error: ${error.message}`);
            return error;
          },
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
