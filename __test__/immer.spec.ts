import produce from 'immer';

describe('immer test', () => {
  it('produce', () => {
    let obj = { a: 1 };
    obj = produce(obj, (draft) => {
      draft.a = draft.a + 1;
    });
    expect(obj).toHaveProperty('a', 2);
  });
});
