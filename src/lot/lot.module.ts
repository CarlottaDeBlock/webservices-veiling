import { Module } from '@nestjs/common';
import { LotController } from './lot.controller';
import { LotService } from './lot.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { LotTasks } from './lot.tasks';

@Module({
  imports: [DrizzleModule],
  controllers: [LotController],
  providers: [LotService, LotTasks],
  exports: [LotService],
})
export class LotModule {}
