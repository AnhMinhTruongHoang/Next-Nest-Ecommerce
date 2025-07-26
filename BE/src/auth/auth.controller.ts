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
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { RolesService } from 'src/roles/roles.service';
import { Public, ResponseMessage, Users } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { MESSAGES } from '@nestjs/core/constants';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
    private configService: ConfigService,
    private mailerService: MailerService,
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

  //////////////
  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage('Get user information')
  @Get('/account')
  async handleGetAccount(@Users() user: IUser) {
    const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp.permissions;
    return { user };
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
  @Post('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @Users() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }

  ///send mail

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'minhlapro01@gmail.com', // List of receivers
      subject: 'Testing Nest MailerModule ✔', // Subject line
      text: 'welcome', // Plaintext body
      template: 'register',
      context: {
        name: 'minh',
        activationCode: 123,
      },
    });

    return 'ok';
  }
}
