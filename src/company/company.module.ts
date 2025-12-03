import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [DrizzleModule],
})
export class CompanyModule {}
