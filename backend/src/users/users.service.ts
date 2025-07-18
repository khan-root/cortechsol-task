import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { User } from 'prisma/generated';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<{ message: string; data: User[] }> {
    try {
      const users = await this.prisma.user.findMany();
      if (users.length === 0) {
        return {
          message: 'No users found',
          data: [],
        };
      }
      return {
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async searchUsers(query: string): Promise<{ message: string; data: User[] }> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { full_name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
      });
      if (users.length === 0) {
        return {
          message: 'No users found',
          data: [],
        };
      }
      return {
        message: 'Users fetched successfully',
        data: users,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
