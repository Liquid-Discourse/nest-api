import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// Custom modules
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
