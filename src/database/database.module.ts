import { Module } from '@nestjs/common';
// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
// Our logic
import { DatabaseService } from './database.service';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return isProd
          ? {
              url: process.env.DATABASE_URL,
              type: 'postgres',
              synchronize: (process.env
                .DATABASE_SYNCHRONIZE as unknown) as boolean,
              autoLoadEntities: true,
            }
          : {
              host: process.env.DATABASE_HOST,
              port: (process.env.DATABASE_PORT as unknown) as number,
              username: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASSWORD,
              database: process.env.DATABASE_NAME,
              type: 'postgres',
              synchronize: (process.env
                .DATABASE_SYNCHRONIZE as unknown) as boolean,
              autoLoadEntities: true,
            };
      },
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
