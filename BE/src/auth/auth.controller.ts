import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Public, ResponseMessage, Users } from 'src/health/decorator/customize';
import { IUser } from 'src/types/user.interface';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { UsersService } from 'src/modules/users/users.service';
import {
  ChangePasswordDto,
  CodeAuthDto,
  RegisterUserDto,
  UserLoginDto,
} from 'src/modules/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @ApiBody({ type: UserLoginDto }) // swagger get token
  @Throttle(5, 60)
  @Post('/login')
  @ResponseMessage('User Login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  // get current user

  @ResponseMessage('Get user information')
  @UseGuards(AuthGuard('jwt'))
  @Get('/account')
  async handleGetAccount(@Users() user: IUser) {
    const foundUser = await this.usersService.findOne(user._id);
    return { user: foundUser };
  }

  //////////////
  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  /// verify mail code
  @Public()
  @ResponseMessage('verify register code')
  @Post('check-code')
  checkCode(@Body() registerUserDto: CodeAuthDto) {
    return this.authService.checkCode(registerUserDto);
  }

  @Public()
  @ResponseMessage('Get User by refresh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Logout User')
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @Users() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }

  // re-send mail
  @Public()
  @ResponseMessage('re-verify register code')
  @Post('retry-active')
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }
  /// send forgot password mail
  @Public()
  @ResponseMessage('re-password register code')
  @Post('retry-password')
  retryPassword(@Body('email') email: string) {
    return this.authService.retryPassword(email);
  }
  /// change-password

  @Public()
  @ResponseMessage('change-password')
  @Post('change-password')
  changePassword(@Body() data: ChangePasswordDto) {
    return this.authService.changePassword(data);
  }

  @Public()
  @ResponseMessage('Sync OAuth user')
  @Post('/sync')
  async syncOAuthUser(
    @Body() body: { email: string; name: string; provider?: string },
  ) {
    return this.authService.syncOAuthUser(body.email, body.name, body.provider);
  }

  @Public()
  @Post('social-media')
  @ResponseMessage('Login/Sync user from social provider')
  async socialMedia(
    @Body() body: { type?: string; email?: string; name?: string },
  ) {
    const { email, name, type } = body;
    return this.authService.syncOAuthUser(email, name, type);
  }
}
