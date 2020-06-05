import { Module } from '@nestjs/common';
// ENV config
import { ConfigService } from '@nestjs/config';
// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
// Our logic
import { DatabaseService } from './database.service';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return isProd
          ? {
              url: process.env.DATABASE_URL,
              ssl: true,
              type: 'postgres',
              synchronize: (process.env
                .DATABASE_SYNCHRONIZE as unknown) as boolean,
              autoLoadEntities: true,
            }
          : {
              host: configService.get('DATABASE_HOST'),
              port: +configService.get<number>('DATABASE_PORT'),
              username: configService.get('DATABASE_USERNAME'),
              password: configService.get('DATABASE_PASSWORD'),
              database: configService.get('DATABASE_NAME'),
              type: 'postgres',
              synchronize: configService.get<boolean>(
                'DATABASE_SYNCHRONIZE',
                false,
              ),
              autoLoadEntities: true,
            };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
