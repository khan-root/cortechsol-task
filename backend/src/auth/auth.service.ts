import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { RegisterDto } from './dtos/register-dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login-dto';
import { User } from 'prisma/generated';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, full_name, password } = registerDto;

    const findUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        full_name,
        password_hash: hashedPassword,
      },
    });

    return {
      message: 'User created successfully',
    };
  }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const findUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      findUser.password_hash, 
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return findUser;
  }
}
