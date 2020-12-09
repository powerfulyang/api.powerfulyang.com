import { cut, load } from 'nodejieba';

describe('node jie ba test', function () {
  it('should ', function () {
    load({
      userDict: require.resolve('./user.dict.utf8'),
    });
    const arr = cut('武汉市长江大桥');
    expect(arr.pop()).toBe('江大桥');
  });
});
