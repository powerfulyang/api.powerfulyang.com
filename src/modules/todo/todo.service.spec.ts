import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { AppModule } from '@/app.module';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('get all todo', async () => {
    const res = await service.findAll();
    expect(res).toBeDefined();
  });
});
