import { sha1 } from '@powerfulyang/node-utils';

describe('utils test', function () {
    it('sha1', function () {
        expect(sha1('我是机器人')).toBe(
            '425a666053295fecbdd5815872ccb9a6196b5df2',
        );
    });
});
