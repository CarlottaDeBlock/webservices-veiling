import { Injectable, NotFoundException } from '@nestjs/common';
import { LOTS, Lot } from '../data/mock_data';
import { CreateLotDto, LotListResponseDto, LotResponseDto } from './lot.dto';

@Injectable()
export class LotService {
  getAll(): LotListResponseDto {
    return { items: LOTS };
  }

  getById(id: string): LotResponseDto {
    const lot = LOTS.find((l) => l.lot_id === id);
    if (!lot) throw new NotFoundException('Lot not found');
    return lot;
  }

  create(data: CreateLotDto): LotResponseDto {
    const newLot: Lot = {
      ...data,
      lot_id: String(Date.now()),
      created_at: new Date(),
    };
    LOTS.push(newLot);
    return newLot;
  }

  updateById(id: string, data: CreateLotDto): LotResponseDto {
    const index = LOTS.findIndex((l) => l.lot_id === id);
    if (index === -1) throw new NotFoundException('Lot not found');
    LOTS[index] = { ...LOTS[index], ...data };
    return LOTS[index];
  }

  deleteById(id: string): void {
    const index = LOTS.findIndex((l) => l.lot_id === id);
    if (index === -1) throw new NotFoundException('Lot not found');
    LOTS.splice(index, 1);
  }
}
