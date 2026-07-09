import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'generated/prisma_client/client';
import { PrismaClientOrTx } from 'src/shared/types/prisma.types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateUserDto,
    tx: PrismaClientOrTx = this.prisma,
  ): Promise<User> {
    return await tx.user.create({ data });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        tenant: true,
        name: true,
        lastname: true,
        email: true,
        created_at: true,
      },
    });
  }

  findByEmail(
    email: string,
    tx: PrismaClientOrTx = this.prisma,
  ): Promise<User | null> {
    return tx.user.findUnique({ where: { email } });
  }
}
