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
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  InvoiceListResponseDto,
  InvoiceResponseDto,
} from './invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  getAll(): InvoiceListResponseDto {
    return this.invoiceService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): InvoiceResponseDto {
    return this.invoiceService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createInvoiceDto: CreateInvoiceDto): InvoiceResponseDto {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: CreateInvoiceDto,
  ): InvoiceResponseDto {
    return this.invoiceService.updateById(id, updateInvoiceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.invoiceService.deleteById(id);
  }
}
