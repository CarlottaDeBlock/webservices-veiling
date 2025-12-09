import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SessionController } from './session.controller';

@Module({
  imports: [AuthModule],
  controllers: [SessionController],
})
export class SessionModule {}
