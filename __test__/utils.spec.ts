import HashUtils from '@/utils/HashUtils';

describe('utils test', function () {
    it('sha1', function () {
        expect(HashUtils.sha1Hex(Buffer.from('我是机器人'))).toBe(
            '425a666053295fecbdd5815872ccb9a6196b5df2',
        );
    });
});
