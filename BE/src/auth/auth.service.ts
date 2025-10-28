import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordDto,
  CodeAuthDto,
  RegisterUserDto,
} from 'src/modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { IUser } from 'src/types/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // validate user
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) return null;

    const isValid = this.usersService.isValidPassword(pass, user.password);
    if (!isValid) return null;

    // Tạm thời hardcode quyền theo role
    const permissions =
      user.role === 'ADMIN'
        ? ['manage_users', 'view_reports']
        : ['view_profile'];

    return {
      ...user.toObject(),
      permissions,
    };
  }

  ////////////////////////////////////////////
  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };

    const refresh_token = this.createRefreshToken(payload);

    // Update the user with the refresh token
    await this.usersService.updateUserToken(refresh_token, _id);

    // Set the refresh_token as a cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  ////////////////// register

  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user);

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  /// verify email code

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  };

  /// re-send email code
  retryActive = async (data: string) => {
    return await this.usersService.retryActive(data);
  };

  /// re-send mail password
  retryPassword = async (data: string) => {
    return await this.usersService.retryPassword(data);
  };

  /// change password
  changePassword = async (data: ChangePasswordDto) => {
    return await this.usersService.changePassword(data);
  };

  ///

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });
      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

        const refresh_token = this.createRefreshToken(payload);

        // Update the user with the refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());

        // Fetch the user's role
        const userRole = user.role as unknown as { _id: string; name: string };
        const temp = await this.usersService.findOne(userRole._id);

        // Clear the old refresh_token cookie
        response.clearCookie('refresh_token');

        // Set the new refresh_token as a cookie
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException(
          `The refresh token is invalid. Please log in.`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        `The refresh token is invalid. Please log in.`,
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  };

  // ================================
  // SYNC USER FROM OAUTH (Google / GitHub)
  // ================================
  async syncOAuthUser(email: string, name: string, provider?: string) {
    // Kiểm tra có user chưa
    let user = await this.usersService.findOneByUsername(email);

    // Nếu chưa có thì tạo mới
    if (!user) {
      user = await this.usersService.register({
        email,
        name,
        password: Math.random().toString(36).slice(-8),
      });
    }

    // Tạo JWT
    const payload = {
      sub: 'oauth login',
      iss: 'from server',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.createRefreshToken(payload);

    // Lưu refresh token vào DB
    await this.usersService.updateUserToken(refresh_token, user._id.toString());

    // FIX: return phẳng, không lồng data.data
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider,
      },
      access_token,
      refresh_token,
    };
  }
}
