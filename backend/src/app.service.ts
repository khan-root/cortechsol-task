import { Injectable } from '@nestjs/common';
import { PrismaService } from './config/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async getHello(): Promise<string> {
    try {
      const users = await this.prisma.user.findMany({ take: 1 });
      console.log(users);
      return `Database connected. Users table found`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return `Database connection failed: ${errorMessage}`;
    }
  }
}
