import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { CheckUserAccessGuard } from '../auth/guards/userAccess.guard';
import { ParseUserIdPipe } from '../auth/pipes/parseUserId.pipe';

@Module({
  imports: [DrizzleModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, CheckUserAccessGuard, ParseUserIdPipe],
  exports: [UserService],
})
export class UserModule {}
