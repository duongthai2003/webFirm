import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //Strategy nay la cua passport-jwt
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    });
  }

  async validate(payload: any) {
    return this.authService.getCurrentUser(payload.sub);
  }
}
