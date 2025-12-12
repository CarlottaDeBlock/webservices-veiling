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
import { ContractService } from './contract.service';
import {
  CreateContractDto,
  ContractListResponseDto,
  ContractResponseDto,
  UpdateContractDto,
} from './contract.dto';
import { CurrentUser } from '../auth/decorators/currentUser.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { Session } from '../types/auth';
import { Role } from '../auth/roles';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contracts')
@ApiBearerAuth()
@ApiResponse({
  status: 401,
  description: 'Unauthorized - you need to be signed in',
})
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @ApiResponse({
    status: 200,
    description: 'Get all contracts visible for the current user',
    type: ContractListResponseDto,
  })
  @Get()
  async getAll(@CurrentUser() user: Session): Promise<ContractListResponseDto> {
    return this.contractService.getAll(user);
  }

  @ApiResponse({
    status: 200,
    description: 'Get contract by ID',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<ContractResponseDto> {
    return this.contractService.getById(id, user);
  }

  @ApiResponse({
    status: 201,
    description: 'Create contract',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post()
  @Roles(Role.ADMIN, Role.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createContractDto: CreateContractDto,
  ): Promise<ContractResponseDto> {
    return this.contractService.create(createContractDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Update contract',
    type: ContractResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
    @Body() updateContractDto: UpdateContractDto,
  ): Promise<ContractResponseDto> {
    return this.contractService.updateById(id, updateContractDto, user);
  }

  @ApiResponse({
    status: 204,
    description: 'Delete contract',
  })
  @ApiResponse({
    status: 404,
    description: 'Contract not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: Session,
  ): Promise<void> {
    await this.contractService.deleteById(id, user);
  }
}
