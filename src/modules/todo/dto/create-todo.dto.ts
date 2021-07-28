import { Todo } from '@/modules/todo/entities/todo.entity';
import { IsNotEmpty } from 'class-validator';
import { TodoPeriod } from '@/modules/todo/entities/period.enum';

export class CreateTodoDto extends Todo {
  @IsNotEmpty()
  info: string;

  @IsNotEmpty()
  period: TodoPeriod;
}
