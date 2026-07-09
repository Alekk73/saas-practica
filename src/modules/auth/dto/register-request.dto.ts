import { CreateTenantDto } from 'src/modules/tenants/dto/create-tenant.dto';
import { RegisterDto } from './register.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterRequestDto {
  @ValidateNested()
  @Type(() => CreateTenantDto)
  tenant: CreateTenantDto;

  @ValidateNested()
  @Type(() => RegisterDto)
  user: RegisterDto;
}
