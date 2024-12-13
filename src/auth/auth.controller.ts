import { Controller, Post, UseGuards,  Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req, @Res({passthrough: true}) res: Response) {
    const user = await this.authService.login(req.user);
    res.cookie('shift', user.refreshToken, { secure: false, httpOnly: true });
    return res.send(user);

  }
  @Post('login/refresh')
  async getNewTokens(@Req() req: Request, @Res({passthrough: true}) res: Response){
      const refreshTokenFromCookies = req.cookies['refreshToken']
      if (!refreshTokenFromCookies){
          res.clearCookie('refreshToken');
          throw new UnauthorizedException("Refresh not passed")
      }
      const tokens = await this.authService.getNewTokens(refreshTokenFromCookies);
      // res.cookie('refreshToken', tokens.refreshToken, { secure: false, httpOnly: true });
      return res.send({token: tokens.token});
  }


}
