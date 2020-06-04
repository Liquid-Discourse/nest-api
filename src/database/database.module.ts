import { Module } from '@nestjs/common';
// ENV config
import { ConfigService } from '@nestjs/config';
// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
// Our logic
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
        autoLoadEntities: true,
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
