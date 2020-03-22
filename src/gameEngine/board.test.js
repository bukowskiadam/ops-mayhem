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
    const board = Board(3, COMPUTER.GOOD);

    expect(board.count(COMPUTER.GOOD)).toBe(board.fieldsCount);

    board.setField(2, COMPUTER.OVERDUE);
    board.setField(3, COMPUTER.OVERDUE);
    board.setField(5, COMPUTER.BAD);
    board.setField(6, COMPUTER.BAD);

    expect(board.count(COMPUTER.OVERDUE)).toBe(2);
    expect(board.count(COMPUTER.BAD)).toBe(2);
    expect(board.count(COMPUTER.GOOD)).toBe(board.fieldsCount - 2 - 2);
  });

  it('throws exception when trying to set field out of the board size', () => {
    const board = Board(3, COMPUTER.GOOD);

    expect(() => board.setField(board.fieldsCount, COMPUTER.BAD)).toThrow();
  });
});
