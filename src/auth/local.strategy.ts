import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  //Strategy nay la cua passport-local
  constructor(private authService: AuthService) {
    super({
      // mac dinh cuar no la username
      //nen muon doi thanh email thi phai custom o day
      usernameField: 'email',
    });
  }
  //async validate cai ham nay no la mac dinh ko dc doi
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
