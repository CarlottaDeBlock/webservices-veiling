import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateLotDto,
  LotDetailResponseDto,
  LotListResponseDto,
  LotResponseDto,
} from './lot.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { eq, InferSelectModel, and, lte } from 'drizzle-orm';
import {
  bids,
  contracts,
  lots,
  auctions,
  userFavoriteLots,
  users,
} from '../drizzle/schema';
import { BidWithUserResponseDto } from '../bid/bid.dto';

type BidRow = InferSelectModel<typeof bids> & {
  bidder: InferSelectModel<typeof users>;
};

@Injectable()
export class LotService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<LotListResponseDto> {
    const rows = await this.db.query.lots.findMany({
      with: {
        requester: true,
        winner: true,
      },
    });

    const items: LotResponseDto[] = rows.map((row) => ({
      lotId: row.lotId,
      auctionId: row.auctionId,
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
      isReversed: row.isReversed,
      canBidHigher: row.canBidHigher,
      createdAt: row.createdAt,
    }));

    return { items };
  }

  async getById(id: number): Promise<LotDetailResponseDto> {
    const lot = await this.db.query.lots.findFirst({
      where: eq(lots.lotId, id),
      with: {
        requester: true,
        bids: {
          with: {
            bidder: true,
          },
        },
      },
    });

    if (!lot) {
      throw new NotFoundException({
        message: 'Lot not found',
        details: { id },
      });
    }

    const bidsWithUser: BidWithUserResponseDto[] = (lot.bids as BidRow[]).map(
      (b) => ({
        bidId: b.bidId,
        amount: Number(b.amount),
        bidTime: b.bidTime,
        bidder: {
          userId: b.bidder.userId,
          username: b.bidder.username,
          email: b.bidder.email,
        },
      }),
    );

    return {
      lotId: lot.lotId,
      auctionId: lot.auctionId,
      requesterId: lot.requesterId,
      title: lot.title,
      requester: lot.requester,
      description: lot.description,
      startTime: lot.startTime,
      endTime: lot.endTime,
      winnerId: lot.winnerId,
      category: lot.category,
      reservedPrice: lot.reservedPrice,
      buyPrice: lot.buyPrice,
      startBid: lot.startBid,
      status: lot.status,
      extraInformation: lot.extraInformation,
      isReversed: lot.isReversed,
      canBidHigher: lot.canBidHigher,
      createdAt: lot.createdAt,
      bids: bidsWithUser,
    };
  }

  async create(data: CreateLotDto): Promise<LotResponseDto> {
    await this.ensureWithinAuctionPeriod(data);
    const [inserted] = await this.db
      .insert(lots)
      .values(<typeof lots.$inferInsert>{
        auctionId: data.auctionId,
        requesterId: data.requesterId!,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        winnerId: null,
        category: data.category,
        reservedPrice: data.reservedPrice,
        buyPrice: data.buyPrice ?? null,
        startBid: data.startBid,
        status: data.status!,
        extraInformation: data.extraInformation ?? null,
        isReversed: data.isReversed,
        canBidHigher: data.canBidHigher,
      })
      .$returningId();

    return this.getById(inserted.lotId);
  }

  async updateById(id: number, data: CreateLotDto): Promise<LotResponseDto> {
    await this.ensureWithinAuctionPeriod(data);

    await this.db
      .update(lots)
      .set({
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
        isReversed: data.isReversed,
        canBidHigher: data.canBidHigher,
      })
      .where(eq(lots.lotId, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(lots).where(eq(lots.lotId, id));
    if (result.affectedRows === 0) {
      throw new NotFoundException({
        message: 'Lot not found',
        details: { id },
      });
    }
  }

  async getFavoriteLotsByUserId(userId: number): Promise<LotResponseDto[]> {
    const favorites = await this.db.query.userFavoriteLots.findMany({
      where: eq(userFavoriteLots.userId, userId),
      with: { lot: true },
    });

    return favorites.map((fav) => ({
      lotId: fav.lot.lotId,
      auctionId: fav.lot.auctionId,
      requesterId: fav.lot.requesterId,
      title: fav.lot.title,
      description: fav.lot.description,
      startTime: fav.lot.startTime,
      endTime: fav.lot.endTime,
      winnerId: fav.lot.winnerId,
      category: fav.lot.category,
      reservedPrice: fav.lot.reservedPrice,
      buyPrice: fav.lot.buyPrice,
      startBid: fav.lot.startBid,
      status: fav.lot.status,
      extraInformation: fav.lot.extraInformation,
      isReversed: fav.lot.isReversed,
      canBidHigher: fav.lot.canBidHigher,
      createdAt: fav.lot.createdAt,
    }));
  }

  async addFavoriteLot(userId: number, lotId: number): Promise<void> {
    await this.db
      .insert(userFavoriteLots)
      .values({ userId, lotId })
      .onDuplicateKeyUpdate({ set: {} });
  }

  async removeFavoriteLot(userId: number, lotId: number): Promise<void> {
    await this.db
      .delete(userFavoriteLots)
      .where(
        and(
          eq(userFavoriteLots.userId, userId),
          eq(userFavoriteLots.lotId, lotId),
        ),
      );
  }

  async toggleFavorite(userId: number, lotId: number) {
    const existing = await this.db.query.userFavoriteLots.findFirst({
      where: and(
        eq(userFavoriteLots.userId, userId),
        eq(userFavoriteLots.lotId, lotId),
      ),
    });

    if (existing) {
      await this.db
        .delete(userFavoriteLots)
        .where(
          and(
            eq(userFavoriteLots.userId, userId),
            eq(userFavoriteLots.lotId, lotId),
          ),
        );

      return { lotId, isFavorite: false };
    }

    await this.db.insert(userFavoriteLots).values({ userId, lotId });
    return { lotId, isFavorite: true };
  }

  async getFavoritesForUser(userId: number) {
    const rows = await this.db.query.userFavoriteLots.findMany({
      where: eq(userFavoriteLots.userId, userId),
      with: {
        lot: {
          with: {
            auction: true,
          },
        },
      },
    });

    return {
      items: rows.map((row) => ({
        lotId: row.lot.lotId,
        title: row.lot.title,
        category: row.lot.category,
        status: row.lot.status,
        auctionId: row.lot.auctionId,
        startTime: row.lot.startTime,
        endTime: row.lot.endTime,
      })),
    };
  }

  private async ensureWithinAuctionPeriod(data: CreateLotDto) {
    const auction = await this.db.query.auctions.findFirst({
      where: eq(auctions.auctionId, data.auctionId),
    });

    if (!auction) {
      throw new NotFoundException({
        message: 'Auction not found for lot',
        details: { auctionId: data.auctionId },
      });
    }

    const auctionStart = new Date(auction.startTime);
    const auctionEnd = new Date(auction.endTime);
    const lotStart = new Date(data.startTime);
    const lotEnd = new Date(data.endTime);

    if (lotStart < auctionStart || lotEnd > auctionEnd) {
      throw new BadRequestException({
        message: 'Lot time must be within auction period',
        details: {
          auctionId: data.auctionId,
          auctionPeriod: {
            startTime: auctionStart.toISOString(),
            endTime: auctionEnd.toISOString(),
          },
          lot: {
            startTime: lotStart.toISOString(),
            endTime: lotEnd.toISOString(),
          },
        },
      });
    }
  }

  async buyNow(
    lotId: number,
    buyerId: number,
  ): Promise<{ contractId: number }> {
    const lot = await this.db.query.lots.findFirst({
      where: eq(lots.lotId, lotId),
      with: { auction: true },
    });

    if (!lot) {
      throw new NotFoundException({
        message: 'Lot not found',
        details: { lotId },
      });
    }

    if (!lot.buyPrice) {
      throw new BadRequestException({
        message: 'Lot has no buy-now price',
        details: { lotId },
      });
    }

    if (lot.status !== 'open') {
      throw new BadRequestException({
        message: 'Lot is not open',
        details: { status: lot.status },
      });
    }

    const now = new Date();
    if (now < lot.startTime || now > lot.endTime) {
      throw new BadRequestException({
        message: 'Lot is not in active period',
        details: { lotId, startTime: lot.startTime, endTime: lot.endTime },
      });
    }

    // 1) lot sluiten + winnaar zetten
    await this.db
      .update(lots)
      .set({
        status: 'closed',
        winnerId: buyerId,
      })
      .where(and(eq(lots.lotId, lotId), eq(lots.status, 'open')));

    // 2) contract aanmaken
    const [inserted] = await this.db
      .insert(contracts)
      .values(<typeof contracts.$inferInsert>{
        auctionId: lot.auctionId,
        providerId: buyerId,
        requesterId: lot.requesterId,
        agreedPrice: lot.buyPrice,
        startDate: now,
        endDate: lot.endTime,
        status: 'active',
      })
      .$returningId();

    return { contractId: inserted.contractId };
  }

  async closeLot(lotId: number) {
    const lot = await this.db.query.lots.findFirst({
      where: eq(lots.lotId, lotId),
    });
    if (!lot || lot.status !== 'open') return;

    const highestBid = await this.db.query.bids.findFirst({
      where: eq(bids.lotId, lotId),
      orderBy: (b, { desc }) => [desc(b.amount), desc(b.bidTime)],
    });

    if (!highestBid) {
      await this.db
        .update(lots)
        .set({ status: 'cancelled', winnerId: null })
        .where(eq(lots.lotId, lotId));
      return;
    }

    const bidAmount = Number(highestBid?.amount);
    const reserved = Number(lot.reservedPrice);

    if (bidAmount < reserved) {
      await this.db
        .update(lots)
        .set({ status: 'cancelled', winnerId: null })
        .where(eq(lots.lotId, lotId));
      return;
    }

    await this.db
      .update(lots)
      .set({ status: 'closed', winnerId: highestBid.bidderId })
      .where(eq(lots.lotId, lotId));

    await this.db
      .insert(contracts)
      .values({
        auctionId: lot.auctionId,
        providerId: highestBid.bidderId,
        requesterId: lot.requesterId,
        agreedPrice: bidAmount.toFixed(2),
        startDate: new Date(),
        endDate: new Date(), // later aanpassen
        status: 'pending',
      })
      .$returningId();
  }

  async closeExpiredLots() {
    const now = new Date();
    const expiredLots = await this.db.query.lots.findMany({
      where: and(eq(lots.status, 'open'), lte(lots.endTime, now)),
      with: {
        auction: true,
        requester: true,
      },
    });

    for (const lot of expiredLots) {
      await this.closeLot(lot.lotId);
    }
  }
}
