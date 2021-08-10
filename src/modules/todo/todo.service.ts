import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '@/modules/todo/entities/todo.entity';
import { Repository } from 'typeorm';
import { AppLogger } from '@/common/logger/app.logger';
import { TodoPeriod } from '@/modules/todo/entities/period.enum';
import dayjs from 'dayjs';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoDao: Repository<Todo>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(TodoService.name);
  }

  initTodo(createTodoDto: CreateTodoDto) {
    const { period, ...todo } = createTodoDto;
    switch (period) {
      case TodoPeriod.Today:
        todo.deadline = dayjs().endOf('day').toDate();
        break;
      case TodoPeriod.ThisWeek:
        todo.deadline = dayjs().endOf('week').toDate();
        break;
      case TodoPeriod.ThisMonth:
        todo.deadline = dayjs().endOf('month').toDate();
        break;
      case TodoPeriod.ThisQuarter:
        todo.deadline = dayjs().endOf('quarter').toDate();
        break;
      case TodoPeriod.ThisYear:
        todo.deadline = dayjs().endOf('year').toDate();
        break;
      case TodoPeriod.InNextDay:
        todo.deadline = dayjs().add(1, 'day').endOf('day').toDate();
        break;
      case TodoPeriod.InNextWeek:
        todo.deadline = dayjs().add(1, 'week').endOf('day').toDate();
        break;
      case TodoPeriod.InNextMonth:
        todo.deadline = dayjs().add(1, 'month').endOf('day').toDate();
        break;
      case TodoPeriod.InNextHalfYear:
        todo.deadline = dayjs().add(6, 'month').endOf('day').toDate();
        break;
      case TodoPeriod.InNextYear:
        todo.deadline = dayjs().add(1, 'year').endOf('day').toDate();
        break;
      default:
        todo.deadline = dayjs().toDate();
    }
    return this.create(todo);
  }

  create(todo: Todo) {
    return this.todoDao.save(todo);
  }

  findAll() {
    return this.todoDao.findAndCount({
      relations: [Todo.relationColumnCreateBy, Todo.relationColumnUpdateBy],
    });
  }

  findOne(id: number) {
    return this.todoDao.findOne(id, {
      relations: [Todo.relationColumnCreateBy, Todo.relationColumnUpdateBy],
    });
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.todoDao.update(id, updateTodoDto);
  }

  remove(id: number) {
    return this.todoDao.delete(id);
  }
}
