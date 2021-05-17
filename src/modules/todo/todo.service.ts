import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from '@/modules/todo/entities/todo.entity';
import { Repository } from 'typeorm';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoDao: Repository<Todo>) {}

  create(createTodoDto: CreateTodoDto) {
    return this.todoDao.save(createTodoDto);
  }

  findAll() {
    return this.todoDao.findAndCount();
  }

  findOne(id: number) {
    return this.todoDao.findOne(id);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.todoDao.update(id, updateTodoDto);
  }

  remove(id: number) {
    return this.todoDao.delete(id);
  }
}
