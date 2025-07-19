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
import { IsFutureDate } from 'src/decorator/is-future-date.decorator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNotEmpty()
  @IsString()
  assignee_id: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @Transform(({ value }) => new Date(Number(value) * 1000), {
    toClassOnly: true,
  })
  @IsDate()
  @IsFutureDate()
  due_date: Date;
}
