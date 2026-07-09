import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { RegisterDto } from './dto/register.dto';
// import { CreateTenantDto } from '../tenants/dto/create-tenant.dto';
import { RegisterRequestDto } from './dto/register-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() body: RegisterRequestDto) {
    return this.authService.register(body.user, body.tenant);
  }
}
