import { Game } from './game.js';
import { COMPUTER, GAME_STATUS } from './consts';

jest.useFakeTimers();

describe('Game', () => {
  let game;

  const timeOfRest = 1000;
  const boardSize = 3;

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

  const expectBoardOnlyOf = (computerStatus) => {
    const { board } = gameState();
    expect(board.count(computerStatus)).toBe(board.getFields().length);
  };

  it('creates new game instance with required methods', () => {
    expect(game).toBeInstanceOf(Object);
    expect(game).toStrictEqual({
      run: expect.any(Function),
      getState: expect.any(Function),
      action: expect.any(Function),
      destroy: expect.any(Function),
    });
  });

  it('returns current game status when game is started', () => {
    expect(gameState().status).toBe(GAME_STATUS.NOT_STARTED);

    game.run();

    expect(gameState().status).toBe(GAME_STATUS.RUNNING);
  });

  it('returns board size', () => {
    expect(gameState().boardSize).toBe(boardSize);
  });

  it('starts the game with board of only good computers', () => {
    expect(gameState().board).toBe(null);

    game.run();

    expectBoardOnlyOf(COMPUTER.GOOD);
  });

  it('returns board with one bad computer after the time of rest', () => {
    game.run();

    jest.advanceTimersByTime(timeOfRest - 10);

    expectBoardOnlyOf(COMPUTER.GOOD);

    jest.advanceTimersByTime(20);

    expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
  });
});
