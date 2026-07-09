// prisma/types.ts (o donde tengas los shared types)
import { Prisma } from 'generated/prisma_client/client';
import { PrismaService } from '../../../prisma/prisma.service';

export type PrismaClientOrTx = PrismaService | Prisma.TransactionClient;
