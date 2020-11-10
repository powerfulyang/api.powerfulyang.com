import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-google-oauth20';
import { getStringVal } from '@/utils/getStringVal';
import { getRandomString, sha1 } from '@powerfulyang/node-utils';
import { UserDto } from '@/entity/dto/UserDto';
import { flatten, pick } from 'ramda';
import { AppLogger } from '@/common/logger/app.logger';
import { Menu } from '@/entity/menu.entity';
import { RoleService } from '@/modules/user/role/role.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        readonly userDao: Repository<User>,
        private jwtService: JwtService,
        private logger: AppLogger,
        private readonly roleService: RoleService,
    ) {
        this.logger.setContext(UserService.name);
    }

    async googleUserRelation(profile: Profile) {
        const openid = profile.id;
        let user = await this.userDao.findOne({
            googleOpenId: openid,
        });
        if (!user) {
            user = new User();
            user.email = getStringVal(
                profile.emails?.find((email: any) => email.verified)
                    ?.value,
            );
            user.avatar = getStringVal(profile.photos?.pop()?.value);
            user.nickname = getStringVal(profile.displayName);
            user.googleOpenId = openid;
            user.roles = [await this.roleService.getDefaultRole()];
            this.generateDefaultPassword(user);
            user = await this.userDao.save(user);
        }
        return this.generateAuthorization(user);
    }

    generateAuthorization(userInfo: Partial<User>) {
        const user = this.pickLoginUserInfo(userInfo);
        return this.jwtService.sign(user);
    }

    generateDefaultPassword(draft: User) {
        draft.passwordSalt = getRandomString();
        draft.password = this.generatePassword(draft.passwordSalt);
    }

    generatePassword(
        salt: string,
        password: string = getRandomString(20),
    ) {
        return sha1(password, salt);
    }

    async login(user: UserDto) {
        const { email, password } = user;
        const userInfo = await this.userDao.findOneOrFail({ email });
        const userPassword = sha1(password, userInfo.passwordSalt);
        if (userPassword === userInfo.password) {
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
        ])(user);
        this.logger.debug(currentUser);
        return currentUser;
    }

    queryUserInfo(id: number) {
        return this.userDao.findOneOrFail(id);
    }

    setUserRole(user: User) {
        return this.userDao.save(user);
    }

    async getUserMenus(id: number) {
        const user = await this.userDao.findOneOrFail(id, {
            relations: ['roles', 'roles.menus'],
        });
        const menus = new Set(
            flatten(user.roles.map((role) => role.menus)),
        );
        return UserService.buildTree(menus);
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
}
