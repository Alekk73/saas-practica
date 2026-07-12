import { sign, SignOptions } from 'jsonwebtoken';
import {
  JwtPayload,
  JwtPayloadInviteToTenant,
} from 'src/shared/interfaces/jwt-payload.interface';

export function generateToken(
  payload: JwtPayload | JwtPayloadInviteToTenant,
  options: SignOptions,
): string {
  const { expiresIn } = options;

  return sign(payload, String(process.env.JWT_SECRET), {
    expiresIn,
  });
}
