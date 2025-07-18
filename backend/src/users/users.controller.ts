import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { UsersService } from './users.service';
import { User } from 'prisma/generated';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<{ message: string; data: User[] }> {
    return await this.usersService.getUsers();
  }

  @Get('search')
  async searchUsers(
    @Query('q') query: string,
  ): Promise<{ message: string; data: User[] }> {
    return await this.usersService.searchUsers(query);
  }
}
