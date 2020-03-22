import { randomBreakOrder } from './breakOrder';

describe('Random break order', () => {
  it('creates an iterator over all values in random order', () => {
    const size = 4;

    const order = [...randomBreakOrder(size)];

    // flaky way to check is random
    expect(order).not.toStrictEqual([0, 1, 2, 3]);
    expect(order.sort()).toStrictEqual([0, 1, 2, 3]);
  });
});
