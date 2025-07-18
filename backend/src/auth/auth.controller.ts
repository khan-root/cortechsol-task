import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register-dto';
import { LoginDto } from './dtos/login-dto';
import { User } from 'prisma/generated';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/decorator/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto) {
    const user: User = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
}
