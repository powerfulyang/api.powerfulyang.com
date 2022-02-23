import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { generateRandomString, sha1 } from '@powerfulyang/node-utils';
import { flatten, pick } from 'ramda';
import type { Profile } from 'passport';
import { firstItem, isDefined, isUndefined } from '@powerfulyang/utils';
import { getStringVal } from '@/utils/getStringVal';
import type { UserDto } from '@/modules/user/dto/UserDto';
import { User } from '@/modules/user/entities/user.entity';
import { AppLogger } from '@/common/logger/app.logger';
import type { Menu } from '@/modules/user/entities/menu.entity';
import { RoleService } from '@/modules/user/role/role.service';
import { CacheService } from '@/core/cache/cache.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { Family } from '@/modules/user/entities/family.entity';
import { OauthOpenidService } from '@/modules/oauth-openid/oauth-openid.service';
import { SUCCESS } from '@/constants/constants';
import type { SupportOauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { MailService } from '@/core/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userDao: Repository<User>,
    @InjectRepository(Family)
    private readonly familyDao: Repository<Family>,
    private readonly jwtService: JwtService,
    private readonly logger: AppLogger,
    private readonly roleService: RoleService,
    private readonly cacheService: CacheService,
    private readonly oauthOpenidService: OauthOpenidService,
    private readonly mailService: MailService,
  ) {
    this.logger.setContext(UserService.name);
  }

  private static idMapping(data: any[]) {
    return data.reduce((draft, el, i) => {
      draft[el.id] = i;
      return draft;
    }, {});
  }

  private static buildTree(menus: Set<Menu>) {
    const menusArr = [...menus];
    const idMapping = UserService.idMapping(menusArr);
    const root: any[] = [];
    menusArr.forEach((menu) => {
      if (menu.parentId === null) {
        root.push(menu);
        return;
      }
      const parentEl = menusArr[idMapping[menu.parentId]];
      parentEl.children = [...(parentEl.children || []), menu];
    });
    return root;
  }

  generateSaltedPassword(salt: string, password: string) {
    this.logger.debug(`generateSaltedPassword`);
    return sha1(password, salt);
  }

  generateDefaultPassword() {
    const defaultPassword = generateRandomString();
    // default password is salt
    const salt = defaultPassword;
    const saltedPassword = this.generateSaltedPassword(defaultPassword, defaultPassword);
    return {
      salt,
      saltedPassword,
    };
  }

  sendDefaultPassword(email: string, defaultPassword: string) {
    return this.mailService.sendMail(email, '欢迎加入', `初始密码是：${defaultPassword}`);
  }

  async dealLoginRequestFromOauthApplication<T extends Profile>(
    profile: T,
    platform: SupportOauthApplication,
  ) {
    const openid = profile.id;
    const o = await this.oauthOpenidService.findUserByOpenid(openid, platform);
    let user = o?.user;
    const email = profile.emails && firstItem(profile.emails)?.value;
    const avatar = profile.photos && firstItem(profile.photos)?.value;
    if (isUndefined(user)) {
      if (!email) {
        throw new UnauthorizedException('email is required');
      }
      user = await this.userDao.findOne({ email });
      if (isDefined(user)) {
        // 关联新的 openid
        await this.oauthOpenidService.associateOpenid(user, openid, platform);
      }
    }
    if (isUndefined(user)) {
      user = this.userDao.create();
      user.email = email!;
      user.avatar = avatar;
      user.nickname = getStringVal(profile.displayName);
      user = await this.initUserDefaultProperty(user);
      user = await this.createUserAndCached(user);
      // 关联新的 openid
      await this.oauthOpenidService.associateOpenid(user, openid, platform);
      // salt 是默认密码
      await this.sendDefaultPassword(user.email, user.salt);
    } else {
      // 更新头像
      const u = await this.getUserCascadeFamilyInfo(user.id);
      u.avatar = avatar;
      user = await this.updateUserAndCached(u);
    }
    return this.generateAuthorization(user);
  }

  pickUserInfo(user: Partial<User>) {
    this.logger.info(`pickUserInfo`);
    return pick(['id'], user);
  }

  generateAuthorization(user: Partial<User>) {
    return this.jwtService.sign(this.pickUserInfo(user));
  }

  verifyAuthorization(token: string) {
    return this.jwtService.verify(token);
  }

  verifyPassword(password: string, salt: string, saltedPassword: string) {
    this.logger.info(`verifyPassword`);
    const tmp = sha1(password, salt);
    return tmp === saltedPassword;
  }

  /**
   * 使用邮箱密码登录
   * 密码为 null, 禁止登录
   * @param user
   */
  async login(user: UserDto) {
    const { email, password } = user;
    const userInfo = await this.userDao.findOneOrFail({
      select: ['id', 'salt', 'saltedPassword'],
      where: { email, saltedPassword: Not('') },
    });
    const bool = this.verifyPassword(password, userInfo.salt, userInfo.saltedPassword);
    if (!bool) {
      throw new UnauthorizedException('密码错误！');
    }
    return userInfo;
  }

  async getUserMenus(id: number) {
    const user = await this.userDao.findOneOrFail(id);
    const menus = new Set(flatten(user.roles.map((role) => role.menus)));
    return UserService.buildTree(menus);
  }

  updatePassword(id: number, password?: string) {
    const salt = generateRandomString();
    const saltedPassword = this.generateSaltedPassword(salt, password || salt);
    return this.userDao.update(id, { salt, saltedPassword });
  }

  getUserCascadeFamilyInfo(id: User['id']) {
    return this.userDao.findOneOrFail(id, {
      relations: ['families', 'families.members'],
    });
  }

  getUsersCascadeFamilyInfo() {
    return this.userDao.find({
      relations: ['families', 'families.members'],
    });
  }

  async cacheUsers() {
    await this.cacheService.del(REDIS_KEYS.USERS);
    const users = await this.getUsersCascadeFamilyInfo();
    const userMap = users.reduce((acc, user) => {
      Reflect.set(acc, user.id, user);
      return acc;
    }, {} as Record<string, User>);
    if (users.length) {
      return this.cacheService.hSet(REDIS_KEYS.USERS, userMap);
    }
    return SUCCESS;
  }

  getCachedUser(id: User['id']) {
    return this.cacheService.hGet<User>(REDIS_KEYS.USERS, id.toString());
  }

  async initUserDefaultProperty(draft: User) {
    // 默认角色
    const defaultRole = await this.roleService.getDefaultRole();
    draft.roles = [defaultRole];
    // 默认密码
    const { salt, saltedPassword } = this.generateDefaultPassword();
    draft.saltedPassword = saltedPassword;
    draft.salt = salt;
    return draft;
  }

  async createUserAndCached(user: User) {
    const newUser = await this.userDao.save(user);
    // add to cache
    await this.cacheService.hSet(REDIS_KEYS.USERS, user.id.toString(), newUser);
    return newUser;
  }

  async updateUserAndCached(user: User) {
    const updatedUser = await this.userDao.save(user);
    // update to cache
    await this.cacheService.hSet(REDIS_KEYS.USERS, user.id.toString(), updatedUser);
    return updatedUser;
  }

  saveFamily(family: Family) {
    return this.familyDao.save(family);
  }

  queryFamily(id: Family['id']) {
    return this.familyDao.findOneOrFail(id);
  }

  update(id: number, user: Partial<User>) {
    return this.userDao.update(id, user);
  }

  getUserByEmail(email: string) {
    return this.userDao.findOneOrFail({ email });
  }

  getAssetBotUser() {
    return this.getUserByEmail(User.IntendedUsers.BotUser);
  }

  async listAssetPublicUser() {
    return [await this.getAssetBotUser()];
  }

  async initIntendedUsers() {
    const existedUsers = await this.userDao.find();
    if (existedUsers.length) {
      return SUCCESS;
    }
    const users: Partial<User>[] = Object.values(User.IntendedUsers).map((v) => ({
      nickname: v,
      email: v,
    }));
    return this.userDao.insert(users);
  }
}
