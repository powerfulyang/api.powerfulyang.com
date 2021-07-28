import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { AppModule } from '@/app.module';
import { TodoPeriod } from '@/modules/todo/entities/period.enum';
import { UserService } from '@/modules/user/user.service';
import dayjs from 'dayjs';

describe('TodoService', () => {
  let service: TodoService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<TodoService>(TodoService);
    userService = module.get<UserService>(UserService);
  });

  it('get all todo', async () => {
    const res = await service.findAll();
    const times = res[0].map((todo) => {
      return {
        createAt: dayjs(todo.createAt).format('YYYY-MM-DD HH:mm:ss'),
        updateAt: dayjs(todo.updateAt).format('YYYY-MM-DD HH:mm:ss'),
        deadline: dayjs(todo.deadline).format('YYYY-MM-DD HH:mm:ss'),
      };
    });
    expect(times).toBeDefined();
  });

  it('post a todo item', async function () {
    const user = await userService.queryUserInfo(1);
    const res = await service.initTodo({
      period: TodoPeriod.Today,
      info: '今天下班前完成提交。',
      createBy: user,
      updateBy: user,
    });
    expect(res).toBeDefined();
  });
});
