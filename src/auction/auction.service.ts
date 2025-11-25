import { Injectable, NotFoundException } from '@nestjs/common';
import { AUCTIONS, Auction } from '../data/mock_data';
import {
  CreateAuctionRequestDto,
  AuctionResponseDto,
  AuctionListResponseDto,
} from './auction.dto';

@Injectable()
export class AuctionService {
  getAll(): AuctionListResponseDto {
    return { items: AUCTIONS };
  }

  getById(id: string): AuctionResponseDto {
    const auction = AUCTIONS.find((a) => a.auction_id === id);
    if (!auction) {
      throw new NotFoundException(`Auction with id ${id} not found`);
    }
    return auction;
  }

  create(data: CreateAuctionRequestDto): AuctionResponseDto {
    const newAuction: Auction = {
      ...data,
      auction_id: String(Date.now()),
      created_at: new Date(),
    };
    AUCTIONS.push(newAuction);
    return newAuction;
  }

  updateById(id: string, data: CreateAuctionRequestDto): AuctionResponseDto {
    const index = AUCTIONS.findIndex((a) => a.auction_id === id);
    if (index === -1) {
      throw new NotFoundException('Auction not found');
    }
    AUCTIONS[index] = { ...AUCTIONS[index], ...data };
    return AUCTIONS[index];
  }

  deleteById(id: string): void {
    const index = AUCTIONS.findIndex((a) => a.auction_id === id);
    if (index === -1) {
      throw new NotFoundException('Auction not found');
    }
    AUCTIONS.splice(index, 1);
  }
}
