import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/types/user.interface';
import { UsersService } from 'src/users/users.service';

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
  ////////////

  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;

    // Vì bạn đã xoá bảng role => role giờ chỉ là string: 'ADMIN' | 'USER'
    // Bạn không cần truy vấn role nữa, mà gán permission dựa trên role

    let permissions: string[] = [];

    if (role === 'ADMIN') {
      permissions = ['manage_users', 'view_reports']; // hoặc lấy từ constant
    } else if (role === 'USER') {
      permissions = ['view_profile'];
    }

    // Gán req.user ở đây
    return {
      _id,
      name,
      email,
      role,
      permissions,
    };
  }
}
