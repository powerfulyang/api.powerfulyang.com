import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import type { Profile } from 'passport-google-oauth20';
import { getRandomString, sha1 } from '@powerfulyang/node-utils';
import { flatten, groupBy, map, pick } from 'ramda';
import { getStringVal } from '@/utils/getStringVal';
import type { UserDto } from '@/modules/user/dto/UserDto';
import { User } from '@/modules/user/entities/user.entity';
import { AppLogger } from '@/common/logger/app.logger';
import type { Menu } from '@/modules/user/entities/menu.entity';
import { RoleService } from '@/modules/user/role/role.service';
import { CacheService } from '@/core/cache/cache.service';
import { REDIS_KEYS } from '@/constants/REDIS_KEYS';
import { Family } from '@/modules/user/entities/family.entity';
import { getClassStaticProperties } from '@/utils/getClassStaticProperties';
import { OauthApplication, OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import { OauthOpenidService } from '@/modules/oauth-openid/oauth-openid.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    readonly userDao: Repository<User>,
    @InjectRepository(Family)
    private readonly familyDao: Repository<Family>,
    private jwtService: JwtService,
    private logger: AppLogger,
    private readonly roleService: RoleService,
    private cacheService: CacheService,
    private readonly oauthOpenidService: OauthOpenidService,
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

  generatePassword(salt: string, password: string = getRandomString(20)) {
    return sha1(password, salt);
  }

  generateDefaultPassword() {
    const defaultPassword = getRandomString();
    // default password is salt
    const passwordSalt = defaultPassword;
    const password = this.generatePassword(defaultPassword, defaultPassword);
    return {
      passwordSalt,
      password,
    };
  }

  async googleUserRelation(profile: Profile) {
    const openid = profile.id;
    const o = await this.oauthOpenidService.findUserByGoogleOpenid(openid);
    let user = o?.user;
    if (!user) {
      user = new User();
      user.email = getStringVal(profile.emails?.find((email: any) => email.verified)?.value);
      user.avatar = getStringVal(profile.photos?.pop()?.value);
      user.nickname = getStringVal(profile.displayName);
      const oauthOpenid = new OauthOpenid();
      oauthOpenid.application = OauthApplication.google;
      oauthOpenid.openid = openid;
      user.oauthOpenidArr = [oauthOpenid];
      const defaultRole = await this.roleService.getDefaultRole();
      user.roles = [defaultRole];
      const { password, passwordSalt } = this.generateDefaultPassword();
      user.password = password;
      user.passwordSalt = passwordSalt;
      user = await this.createUserAndCached(user);
      // todo 总要发一封邮件吧
    } else {
      // 更新头像
      user.avatar = getStringVal(profile.photos?.pop()?.value);
      user = await this.updateUserAndCached(user);
    }
    return this.generateAuthorization(user);
  }

  generateAuthorization(userInfo: Partial<User>) {
    const user = this.pickLoginUserInfo(userInfo);
    return this.jwtService.sign(user);
  }

  verifyPassword(password: string, salt: string, saltedPassword: string) {
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
    const userInfo = await this.userDao.findOneOrFail({ email, password: Not(IsNull()) });
    const bool = this.verifyPassword(password, userInfo.passwordSalt, userInfo.password);
    if (bool) {
      return this.pickLoginUserInfo(userInfo);
    }
    throw new UnauthorizedException('密码错误！');
  }

  pickLoginUserInfo(user: Partial<User>) {
    const currentUser = pick([
      'id',
      'nickname',
      'email',
      'avatar',
      'createAt',
      'bio',
      'timelineBackground',
    ])(user);
    this.logger.debug(`current user is [ name: ${currentUser.nickname} ]`);
    return currentUser;
  }

  async getUserInfo(id: User['id']) {
    const user = await this.userDao.findOneOrFail({
      where: { id },
      relations: getClassStaticProperties(User),
    });
    return this.pickLoginUserInfo(user);
  }

  queryUser(id: number) {
    return this.userDao.findOneOrFail(id);
  }

  saveUser(user: User) {
    return this.userDao.save(user);
  }

  cascadeUpdateUser(user: User) {
    return this.saveUser(user);
  }

  setUserRole(user: User) {
    return this.saveUser(user);
  }

  async getUserMenus(id: number) {
    const user = await this.userDao.findOneOrFail(id, {
      relations: ['roles', 'roles.menus'],
    });
    const menus = new Set(flatten(user.roles.map((role) => role.menus)));
    return UserService.buildTree(menus);
  }

  updatePassword(id: number, password: string) {
    const user = new User();
    user.passwordSalt = getRandomString();
    user.password = this.generatePassword(user.passwordSalt, password);
    return this.userDao.update(id, user);
  }

  async cacheUsers() {
    this.cacheService.del(REDIS_KEYS.USERS);
    const users = await this.userDao.find({
      relations: getClassStaticProperties(User),
    });
    const usersMap = groupBy<User>((user) => String(user.id), users);
    return this.cacheService.hMSet(
      REDIS_KEYS.USERS,
      map((user) => JSON.stringify(user.pop()), usersMap),
    );
  }

  getCachedUsers(id: User['id']) {
    return this.cacheService.hGet<User>(REDIS_KEYS.USERS, id);
  }

  async createUserAndCached(user: User) {
    const newUser = await this.saveUser(user);
    // add to cache
    this.cacheService.hSet(REDIS_KEYS.USERS, user.id, user);
    return newUser;
  }

  async updateUserAndCached(user: User) {
    const updatedUser = await this.saveUser(user);
    // add to cache
    this.cacheService.hSet(REDIS_KEYS.USERS, user.id, user);
    return updatedUser;
  }

  saveFamily(family: Family) {
    return this.familyDao.save(family);
  }

  queryFamily(id: Family['id']) {
    return this.familyDao.findOneOrFail(id);
  }

  async relationQueryUserAllFamilyMembers(id: User['id']) {
    return this.userDao.findOneOrFail(id, {
      relations: [User.RelationColumnFamilies, User.RelationColumnFamilyMembers],
    });
  }
}
