import { Board } from './board';
import { COMPUTER } from './consts';

describe('Board', () => {
  it('makes square board with a given size and state', () => {
    const size = 3;
    const state = COMPUTER.GOOD;

    const board = Board(size, state);

    expect(board.getFields()).toStrictEqual([
      COMPUTER.GOOD, COMPUTER.GOOD, COMPUTER.GOOD,
      COMPUTER.GOOD, COMPUTER.GOOD, COMPUTER.GOOD,
      COMPUTER.GOOD, COMPUTER.GOOD, COMPUTER.GOOD,
    ]);
    expect(board.fieldsCount).toBe(9);
  });

  it('allows to set given field to given value', () => {
    const board = Board(2, COMPUTER.GOOD);

    board.setField(1, COMPUTER.BAD);
    board.setField(2, COMPUTER.OVERDUE);

    expect(board.getFields()).toStrictEqual([
      COMPUTER.GOOD, COMPUTER.BAD,
      COMPUTER.OVERDUE, COMPUTER.GOOD,
    ]);
  });

  it('allows to count fields with a given state', () => {
    const size = 3;
    const board = Board(size, COMPUTER.GOOD);

    expect(board.count(COMPUTER.GOOD)).toBe(size * size);

    board.setField(2, COMPUTER.OVERDUE);
    board.setField(3, COMPUTER.OVERDUE);
    board.setField(5, COMPUTER.BAD);
    board.setField(6, COMPUTER.BAD);

    expect(board.count(COMPUTER.OVERDUE)).toBe(2);
    expect(board.count(COMPUTER.BAD)).toBe(2);
    expect(board.count(COMPUTER.GOOD)).toBe(size * size - 2 - 2);
  });
});
