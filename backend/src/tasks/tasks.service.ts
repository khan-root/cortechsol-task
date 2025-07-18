import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateTaskDto } from './dtos/create-task-dto';
import { Task } from 'prisma/generated';
import { UpdateTaskDto } from './dtos/update-task-dto';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    task: CreateTaskDto,
  ): Promise<{ message: string; data: Task }> {
    console.log(typeof task.due_date);
    try {
      const newTask = await this.prisma.task.create({
        data: {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignee_id: task.assignee_id,
          due_date: new Date(Number(task.due_date) * 1000),
        },
        include: {
          assignee: {
            select: {
              id: true,
              full_name: true,
            },
          },
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
      const tasks = await this.prisma.task.findMany({
        include: {
          assignee: {
            select: {
              id: true,
              full_name: true,
            },
          },
        },
      });
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
          assignee_id: task.assignee_id,
          due_date: task.due_date
            ? new Date(Number(task.due_date) * 1000)
            : taskToUpdate.due_date,
        },
        include: {
          assignee: {
            select: {
              id: true,
              full_name: true,
            },
          },
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

  // tasks.service.ts
  async uploadFile(id: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      // Clean up uploaded file if task doesn't exist
      if (file.path && existsSync(file.path)) {
        unlinkSync(file.path);
      }
      throw new NotFoundException('Task not found');
    }

    // Update with new attachment
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        attachment_url: `/uploads/${file.filename}`,
      },
      include: {
        assignee: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    return {
      message: 'File uploaded successfully',
      data: updatedTask.attachment_url,
    };
  }
}
