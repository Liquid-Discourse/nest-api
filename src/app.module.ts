import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// Custom modules
import { UsersController } from './users/users.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, UsersController],
  providers: [],
})
export class AppModule {}
