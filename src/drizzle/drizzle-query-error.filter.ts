import type { ExceptionFilter } from '@nestjs/common';
import { Catch, ConflictException, NotFoundException } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';

@Catch(DrizzleQueryError)
export class DrizzleQueryErrorFilter implements ExceptionFilter {
  catch(error: DrizzleQueryError) {
    if (!error.cause || !('code' in error.cause)) {
      throw new Error(error.message || 'Unknown database error');
    }

    const {
      cause: { code, message },
    } = error;

    switch (code) {
      case 'ER_DUP_ENTRY':
        if (message.includes('userId_user_username_unique')) {
          throw new ConflictException(
            'There is already a user with this username',
          );
        } else if (message.includes('userId_user_email_unique')) {
          throw new ConflictException(
            'There is already a user with this email address',
          );
        } else if (message.includes('companyId_company_name_unique')) {
          throw new ConflictException(
            'A company with this name already exists',
          );
        } else if (message.includes('companyId_company_vatNumber_unique')) {
          throw new ConflictException(
            'There is already a company with this vat number',
          );
        } else if (message.includes('companyId_company_peppolId_unique')) {
          throw new ConflictException(
            'There is already a company with this peppol number',
          );
        } else if (message.includes('companyId_company_invoiceEmail_unique')) {
          throw new ConflictException(
            'There is already a company with this invoice email address',
          );
        } else {
          throw new ConflictException('This item already exists');
        }
      case 'ER_NO_REFERENCED_ROW_2':
        if (message.includes('bidder_id')) {
          throw new NotFoundException('No user with this id exists');
        } else if (message.includes('auction_id')) {
          throw new NotFoundException('No auction with this id exists');
        } else if (message.includes('company_id')) {
          throw new NotFoundException('No company with this id exists');
        } else if (message.includes('request_id')) {
          throw new NotFoundException('No user with this id exists');
        } else if (message.includes('bid_id')) {
          throw new NotFoundException('No bid with this id exists');
        } else if (message.includes('contract_id')) {
          throw new NotFoundException('No contract with this id exists');
        } else if (message.includes('provider_id')) {
          throw new NotFoundException('No user with this id exists');
        } else if (message.includes('requester_id')) {
          throw new NotFoundException('No user with this id exists');
        } else if (message.includes('invoice_id')) {
          throw new NotFoundException('No invoice with this id exists');
        } else if (message.includes('lot_id')) {
          throw new NotFoundException('No lot with this id exists');
        } else if (message.includes('winner_id')) {
          throw new NotFoundException('No user with this id exists');
        } else if (message.includes('review_id')) {
          throw new NotFoundException('No review with this id exists');
        } else if (message.includes('reviewer_id')) {
          throw new NotFoundException('No user with this id exists');
        } else if (message.includes('reviewed_user_id')) {
          throw new NotFoundException('No user with this id exists');
        }
        break;
    }

    throw error;
  }
}
