import { Game } from './game.js';
import { COMPUTER, GAME_STATUS } from './consts';

jest.useFakeTimers();

describe('Game', () => {
  let game;

  const timeOfRest = 1000;
  const boardSize = 3;

  const createGame = () => Game({
    timeOfRest,
    boardSize,
  });

  const gameState = () => game.getState();

  const expectBoardOnlyOf = (computerStatus) => {
    const { board } = gameState();
    expect(board.count(computerStatus)).toBe(board.getFields().length);
  };

  describe('generic flow', () => {
    beforeAll(() => {
      game = createGame();
    });

    afterAll(() => {
      game.destroy();
    });

    it('creates new game instance with required methods', () => {
      expect(game).toBeInstanceOf(Object);
      expect(game).toStrictEqual({
        run: expect.any(Function),
        getState: expect.any(Function),
        action: expect.any(Function),
        destroy: expect.any(Function),
      });
    });

    it('returns correct game state before it is started', () => {
      expect(gameState()).toStrictEqual({
        boardSize: 3,
        status: GAME_STATUS.NOT_STARTED,
        board: null,
      });
    });

    it('returns correct game status after game is started', () => {
      game.run();

      expect(gameState().status).toBe(GAME_STATUS.RUNNING);
    });

    it('starts the game with board of only good computers', () => {
      expectBoardOnlyOf(COMPUTER.GOOD);
    });

    it('returns board with one bad computer after the time of rest', () => {
      const veryShortTime = 10;

      jest.advanceTimersByTime(timeOfRest - veryShortTime);

      expectBoardOnlyOf(COMPUTER.GOOD);

      jest.advanceTimersByTime(veryShortTime);

      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });
  });
});
