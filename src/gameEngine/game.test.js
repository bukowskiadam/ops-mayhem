import { Game } from './game.js';
import { COMPUTER, GAME_STATUS } from './consts';
import { countComputers } from './utils';

jest.useFakeTimers();

describe('Game', () => {
  let game;

  const timeOfRest = 1000;
  const boardSize = 3;
  const goodBoard = [
    [COMPUTER.GOOD, COMPUTER.GOOD, COMPUTER.GOOD],
    [COMPUTER.GOOD, COMPUTER.GOOD, COMPUTER.GOOD],
    [COMPUTER.GOOD, COMPUTER.GOOD, COMPUTER.GOOD],
  ];

  beforeEach(() => {
    game = Game({
      timeOfRest,
      boardSize,
    });
  });

  afterEach(() => {
    game.destroy();
  });

  const gameState = () => game.getState();

  it('creates new game instance with required methods', () => {
    expect(game).toBeInstanceOf(Object);
    expect(game).toStrictEqual({
      run: expect.any(Function),
      getState: expect.any(Function),
      action: expect.any(Function),
      destroy: expect.any(Function),
    });
  });

  it('returns current game status', () => {
    expect(gameState().status).toBe(GAME_STATUS.NOT_STARTED);

    game.run();

    expect(gameState().status).toBe(GAME_STATUS.RUNNING);
  });

  it('returns game size', () => {
    expect(gameState().boardSize).toBe(boardSize);
  });

  it('returns current game board', () => {
    expect(gameState().board).toBe(null);

    game.run();

    expect(gameState().board).toStrictEqual(goodBoard);
  });

  it('returns board with one bad computer after the time of rest', () => {
    game.run();

    jest.advanceTimersByTime(timeOfRest - 10);

    expect(gameState().board).toStrictEqual(goodBoard);

    jest.advanceTimersByTime(20);

    const badComputers = countComputers(gameState().board, COMPUTER.BAD);

    expect(badComputers).toBe(1);
  });
});
