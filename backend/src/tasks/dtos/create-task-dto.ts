import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskPriority, TaskStatus } from 'prisma/generated';

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  @IsString()
  assignee_id: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @Transform(({ value }) => new Date(Number(value) * 1000), {
    toClassOnly: true,
  })
  @IsDate()
  due_date: Date;
}
