import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  UploadedFile,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task-dto';
import { Task } from 'prisma/generated';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { UpdateTaskDto } from './dtos/update-task-dto';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createTask(
    @Body() task: CreateTaskDto,
  ): Promise<{ message: string; data: Task }> {
    return await this.tasksService.createTask(task);
  }

  @Get()
  async getTasks(): Promise<{ message: string; data: Task[] }> {
    return await this.tasksService.getTasks();
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string }> {
    return await this.tasksService.deleteTask(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
  ): Promise<{ message: string; data: Task }> {
    return await this.tasksService.updateTask(id, task);
  }

  @Post(':id/upload')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('attachment_url', multerConfig)) // Match your form field name
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() attachment_url: Express.Multer.File, // This will now properly get the file
  ) {
    return this.tasksService.uploadFile(id, attachment_url);
  }
}
