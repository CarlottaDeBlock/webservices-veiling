import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';
import { CompanyModule } from './company/company.module';
import { ContractModule } from './contract/contract.module';
import { InvoiceModule } from './invoice/invoice.module';
import { LotModule } from './lot/lot.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import configuration from './config/configuration';

@Module({
  imports: [
    AuctionModule,
    BidModule,
    CompanyModule,
    ContractModule,
    InvoiceModule,
    LotModule,
    ReviewModule,
    UserModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DrizzleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
