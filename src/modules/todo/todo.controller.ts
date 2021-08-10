import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/decorator/auth-guard.decorator';
import { PathViewCount } from '@/common/decorator/path-view-count.decorator';
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
  @PathViewCount()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  @PathViewCount()
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
