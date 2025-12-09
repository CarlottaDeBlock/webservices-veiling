import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  InvoiceListResponseDto,
  InvoiceResponseDto,
} from './invoice.dto';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import type { Session } from '../types/auth';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/roles';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async getAll(@CurrentUser() user: Session): Promise<InvoiceListResponseDto> {
    return this.invoiceService.getAll(user);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.getById(id, user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.PROVIDER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    return this.invoiceService.updateById(id, updateInvoiceDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.invoiceService.deleteById(id);
  }
}
