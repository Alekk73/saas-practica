import { sign, SignOptions } from 'jsonwebtoken';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';

export function generateToken(
  payload: JwtPayload,
  expiresIn: SignOptions['expiresIn'] = '7d',
): string {
  return sign(payload, String(process.env.JWT_SECRET), {
    expiresIn,
  });
}
