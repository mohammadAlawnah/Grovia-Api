import { UserService } from '../users/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWTPayloadType } from '../utils/types';

import { Reflector } from '@nestjs/core';
import { userType } from '../utils/enums';
@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly UserService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles: userType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]); // read metaData

    if (!roles || roles.length === 0) return false;

    const request: Request = context.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (token && type === 'Berrer') {
      try {
        const payload: JWTPayloadType = await this.jwtService.verifyAsync(
          token,
          {
            secret: this.configService.get<string>('JWT_SECRET'),
          },
        );

        const user = await this.UserService.getCurrentUser(payload.id);
        if (!user) return false;

        console.log('roles =>', roles);
        console.log('user.usertype =>', user.usertype);
        console.log('payload =>', payload);

        if (roles.includes(user.usertype)) {
          request['user'] = payload;
          return true;
        }
      } catch (err) {
        throw new UnauthorizedException('access denied, invalid token');
      }
    } else {
      throw new UnauthorizedException('access denied, no token provided');
    }

    throw new UnauthorizedException('access denied, insufficient role');
  }
}
