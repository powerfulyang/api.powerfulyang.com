import { Query, Resolver } from '@nestjs/graphql';
import { ClickUpService } from './click-up.service';
import { ClickUpList } from './entities/click-up.entity';

@Resolver(() => ClickUpList)
export class ClickUpResolver {
  constructor(private readonly clickUpService: ClickUpService) {}

  @Query(() => [ClickUpList], { name: 'clickUp' })
  getTeams() {
    return this.clickUpService.getTeams();
  }
}
