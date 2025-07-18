import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ((ExtractJwt as any).fromAuthHeaderAsBearerToken as () => any)(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  validate(payload: { email: string; id: string; full_name: string }) {
    return {
      id: payload.id,
      email: payload.email,
      full_name: payload.full_name,
    };
  }
}
