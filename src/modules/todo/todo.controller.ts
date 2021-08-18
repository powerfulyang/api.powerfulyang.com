import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { FamilyMembersFromAuth } from '@/common/decorator/user-from-auth.decorator';
import { User } from '@/entity/user.entity';
import { In } from 'typeorm';
import { pluck } from 'ramda';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
@JwtAuthGuard()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll(@FamilyMembersFromAuth() users: User[]) {
    return this.todoService.relationQuery({
      createBy: In(pluck('id', users)),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
