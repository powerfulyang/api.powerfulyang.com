import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@/modules/post/entities/post.entity';
import { In, Repository } from 'typeorm';
import { countBy, flatten, map, pluck, prop, trim } from 'ramda';
import { User } from '@/modules/user/entities/user.entity';
import { PublishPostDto } from '@/modules/post/dto/publish-post.dto';
import { AssetService } from '@/modules/asset/asset.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postDao: Repository<Post>,
    private readonly assetService: AssetService,
  ) {}

  async publishPost(post: PublishPostDto) {
    if (!post.poster) {
      const randomAsset = await this.assetService.randomAsset();
      Reflect.set(post, 'poster', randomAsset);
    }
    if (post.id) {
      const findPost = await this.postDao.findOneOrFail(post.id);
      findPost.content = post.content;
      if (post.tags) {
        findPost.tags = post.tags;
      }
      findPost.title = post.title;
      return this.postDao.save(findPost);
    }
    const toSave = this.postDao.create(post);
    return this.postDao.save(toSave);
  }

  deletePost(draft: Post) {
    return this.postDao.delete(draft);
  }

  updatePost(post: Post) {
    return this.postDao.update(post.id, post);
  }

  getAllPostByUserIds(ids: User['id'][], post: Post) {
    return this.postDao.find({
      select: ['id', 'title', 'createAt', 'poster'],
      relations: ['poster'],
      order: { id: 'DESC' },
      where: { ...post, createBy: In(ids) },
    });
  }

  get(draft: Post) {
    return this.postDao.findOneOrFail(draft, { relations: [Post.RelationColumnCreateBy] });
  }

  publicRead(post: Post) {
    return this.postDao.findOneOrFail({
      where: { id: post.id, public: true },
      relations: [Post.RelationColumnCreateBy],
    });
  }

  publicList(query: Post) {
    return this.postDao.find({
      select: ['id', 'title', 'createAt', 'poster'],
      relations: ['poster'],
      order: { id: 'DESC' },
      where: {
        ...query,
        public: true,
      },
    });
  }

  tagsArray(justPublic: boolean = true) {
    return this.postDao.find({ select: ['tags'], where: { public: justPublic } });
  }

  async getPublishedTags(ids: User['id'][]) {
    const tagsArr = await this.postDao.find({ select: ['tags'], where: { createBy: In(ids) } });
    const allTags = flatten(map(prop('tags'))(tagsArr));
    return countBy(trim)(allTags);
  }

  async getPublishedYears(ids: User['id'][]) {
    const res: Array<Pick<Post, 'publishYear'>> = await this.postDao
      .createQueryBuilder()
      .select(['publishYear'])
      .where('createById in (:...ids)', {
        ids,
      })
      .distinct(true)
      .getRawMany();
    return pluck('publishYear')(res);
  }

  async publicPublishedYears() {
    const res: Array<Pick<Post, 'publishYear'>> = await this.postDao
      .createQueryBuilder()
      .select(['publishYear'])
      .distinct(true)
      .getRawMany();
    return pluck('publishYear')(res);
  }
}
