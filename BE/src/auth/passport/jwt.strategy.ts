import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/types/user.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const { _id, name, email, role } = payload;

    let permissions: { method: string; apiPath: string }[] = [];

    if (role === 'ADMIN') {
      permissions = [
        { method: 'GET', apiPath: '/users' },
        { method: 'POST', apiPath: '/users' },
        { method: 'PATCH', apiPath: '/users/:id' },
        { method: 'DELETE', apiPath: '/users/:id' },
      ];
    }

    return {
      _id,
      name,
      email,
      role,
      permissions,
    };
  }
}
