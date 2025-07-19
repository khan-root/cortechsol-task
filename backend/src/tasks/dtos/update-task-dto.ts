import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskPriority, TaskStatus } from 'prisma/generated';
import { IsFutureDate } from 'src/decorator/is-future-date.decorator';

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

  @IsOptional()
  @IsString()
  assignee_id?: string;

  @Transform(({ value }) => new Date(Number(value) * 1000), {
    toClassOnly: true,
  })
  @IsDate()
  @IsFutureDate()
  @IsOptional()
  due_date?: Date;
}
