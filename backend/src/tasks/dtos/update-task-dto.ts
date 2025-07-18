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

export class UpdateTaskDto {
  @IsOptional()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @Transform(({ value }) => new Date(Number(value) * 1000), {
    toClassOnly: true,
  })
  @IsDate()
  @IsOptional()
  due_date?: Date;
}
