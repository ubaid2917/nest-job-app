import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verifyToken } from '../constants/auth.constant';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Authorization header missing');
    }

    try {
      const decode = verifyToken(token) as any;

      if (decode?.exp && decode.exp < Date.now() / 1000) {
        throw new UnauthorizedException('Token expired');
      }
      request.user = decode;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
