import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LotService } from './lot.service';

@Injectable()
export class LotTasks {
  constructor(private readonly lotService: LotService) {}

  // elke seconde
  @Cron('* * * * * *')
  async handleCloseExpiredLots() {
    await this.lotService.closeExpiredLots();
  }
}
