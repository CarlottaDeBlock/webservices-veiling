import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLotDto, LotListResponseDto, LotResponseDto } from './lot.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { lots } from '../drizzle/schema';

@Injectable()
export class LotService {
  async getAll(): Promise<LotListResponseDto> {
    const rows = await this.db.query.lots.findMany();

    const items: LotResponseDto[] = rows.map((row) => ({
      lotId: row.lotId,
      requestId: row.requestId,
      requesterId: row.requesterId,
      title: row.title,
      description: row.description,
      startTime: row.startTime,
      endTime: row.endTime,
      winnerId: row.winnerId,
      category: row.category,
      reservedPrice: row.reservedPrice,
      buyPrice: row.buyPrice,
      startBid: row.startBid,
      status: row.status,
      extraInformation: row.extraInformation,
      isReversed: row.isReversed === 1,
      canBidHigher: row.canBidHigher === 1,
      createdAt: row.createdAt,
    }));

    return { items };
  }

  async getById(id: number): Promise<LotResponseDto> {
    const row = await this.db.query.lots.findFirst({
      where: eq(lots.lotId, id),
    });

    if (!row) {
      throw new NotFoundException('Lot not found');
    }

    return {
      lotId: row.lotId,
      requestId: row.requestId,
      requesterId: row.requesterId,
      title: row.title,
      description: row.description,
      startTime: row.startTime,
      endTime: row.endTime,
      winnerId: row.winnerId,
      category: row.category,
      reservedPrice: row.reservedPrice,
      buyPrice: row.buyPrice,
      startBid: row.startBid,
      status: row.status,
      extraInformation: row.extraInformation,
      isReversed: row.isReversed === 1,
      canBidHigher: row.canBidHigher === 1,
      createdAt: row.createdAt,
    };
  }

  async create(data: CreateLotDto): Promise<LotResponseDto> {
    const [inserted] = await this.db
      .insert(lots)
      .values({
        requestId: data.requestId,
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        winnerId: data.winnerId,
        category: data.category,
        reservedPrice: data.reservedPrice,
        buyPrice: data.buyPrice,
        startBid: data.startBid,
        status: data.status,
        extraInformation: data.extraInformation,
        isReversed: data.isReversed ? 1 : 0,
        canBidHigher: data.canBidHigher ? 1 : 0,
      })
      .$returningId();

    return this.getById(inserted.lotId);
  }

  async updateById(id: number, data: CreateLotDto): Promise<LotResponseDto> {
    await this.db
      .update(lots)
      .set({
        requestId: data.requestId,
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        winnerId: data.winnerId,
        category: data.category,
        reservedPrice: data.reservedPrice,
        buyPrice: data.buyPrice,
        startBid: data.startBid,
        status: data.status,
        extraInformation: data.extraInformation,
        isReversed: data.isReversed ? 1 : 0,
        canBidHigher: data.canBidHigher ? 1 : 0,
      })
      .where(eq(lots.lotId, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(lots).where(eq(lots.lotId, id));
    if (result.affectedRows === 0) throw new NotFoundException('Lot not found');
  }

  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}
}
