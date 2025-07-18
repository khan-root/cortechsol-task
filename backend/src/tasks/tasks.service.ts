import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateTaskDto } from './dtos/create-task-dto';
import { Task } from 'prisma/generated';
import { JwtUserPayload } from 'src/utils/types';
import { UpdateTaskDto } from './dtos/update-task-dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    task: CreateTaskDto,
    user: JwtUserPayload,
  ): Promise<{ message: string; data: Task }> {
    console.log(typeof task.due_date);
    try {
      const newTask = await this.prisma.task.create({
        data: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee_id: user.id,
          due_date: new Date(Number(task.due_date) * 1000),
        },
      });
      return {
        message: 'Task created successfully',
        data: newTask,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getTasks(): Promise<{ message: string; data: Task[] }> {
    try {
      const tasks = await this.prisma.task.findMany();
      if (tasks.length === 0) {
        return {
          message: 'No tasks found',
          data: [],
        };
      }
      return {
        message: 'Tasks fetched successfully',
        data: tasks,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    try {
      const task = await this.prisma.task.findUnique({ where: { id } });
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      await this.prisma.task.delete({ where: { id } });
      return {
        message: 'Task deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateTask(
    id: string,
    task: UpdateTaskDto,
  ): Promise<{ message: string; data: Task }> {
    try {
      const taskToUpdate = await this.prisma.task.findUnique({ where: { id } });
      if (!taskToUpdate) {
        throw new NotFoundException('Task not found');
      }
      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date
            ? new Date(Number(task.due_date) * 1000)
            : taskToUpdate.due_date,
        },
      });
      return {
        message: 'Task updated successfully',
        data: updatedTask,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
