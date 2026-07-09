import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [PrismaModule, UsersModule, TenantsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
