import { getTags } from '../src/utils/util';

describe('util test', () => {
    it('reg match', function () {
        const text =
            'エキドナさん·\n' +
            '#reゼロから始める異世界生活 #アニメーション#アニメ#アニメ好きな人と繋がりたい #アニメ好き #エキドナ #美少女#かわいい#可愛い#ライトノベル #魔女\n' +
            '#animation#anime#cute#lovely#kawaii#otaku #animegirl #リゼロ';
        expect(getTags(text)).toBeInstanceOf(Array);
    });
});
