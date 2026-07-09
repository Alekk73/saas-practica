import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from 'generated/prisma_client/client';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaClientOrTx } from 'src/shared/types/prisma.types';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateTenantDto,
    tx: PrismaClientOrTx = this.prisma,
  ): Promise<Tenant> {
    return await tx.tenant.create({ data });
  }

  findAll(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany();
  }

  async findByName(
    name: string,
    tx: PrismaClientOrTx = this.prisma,
  ): Promise<Tenant | null> {
    return await tx.tenant.findUnique({ where: { name } });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    return tenant;
  }
}
