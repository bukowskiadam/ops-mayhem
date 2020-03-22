import { Game } from './game.js';
import { COMPUTER, GAME_STATUS } from './consts';

jest.useFakeTimers();

describe('Game', () => {
  let game;

  const timeOfRest = 1000;
  const timeToFix = 3000;
  const boardSize = 3;
  const maxOverdue = 2;

  const createGame = () => Game({
    timeOfRest,
    timeToFix,
    boardSize,
    maxOverdue,
  });

  const gameState = () => game.getState();

  const expectBoardOnlyOf = (computerStatus) => {
    const { board } = gameState();
    expect(board.count(computerStatus)).toBe(board.fieldsCount);
  };

  const findComputer = (computerStatus) =>
    gameState().board.getFields().findIndex(c => c === computerStatus);

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
        start: expect.any(Function),
        getState: expect.any(Function),
        fix: expect.any(Function),
        destroy: expect.any(Function),
      });
    });

    it('returns correct game state before it is started', () => {
      expect(gameState()).toStrictEqual({
        boardSize: 3,
        status: GAME_STATUS.NOT_STARTED,
        board: null,
        level: 0,
      });
    });

    it('returns correct game status after game is started', () => {
      game.start();

      expect(gameState().status).toBe(GAME_STATUS.RUNNING);
    });

    it('starts the game with board of only good computers', () => {
      expectBoardOnlyOf(COMPUTER.GOOD);
    });

    it('breaks first computer after the time of rest', () => {
      jest.advanceTimersByTime(timeOfRest);

      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('allows to fix first broken computer', () => {
      const brokenComputer = findComputer(COMPUTER.BAD);

      game.fix(brokenComputer);

      expectBoardOnlyOf(COMPUTER.GOOD);
    });

    it('breaks second computer after the time of rest', () => {
      jest.advanceTimersByTime(timeOfRest);

      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('sets second computer as overdue after the time to fix', () => {
      jest.advanceTimersByTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
    });

    it('breaks third computer after the time of rest', () => {
      jest.advanceTimersByTime(timeOfRest);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('allows to fix overdue computer but time for bad goes on', () => {
      const overdueComputer = findComputer(COMPUTER.OVERDUE);

      game.fix(overdueComputer);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(0);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);

      jest.advanceTimersByTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(0);
    });

    it('breaks fourth computer after the time of rest', () => {
      jest.advanceTimersByTime(timeOfRest);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('does nothing if you try to fix good computer', () => {
      const goodComputer = findComputer(COMPUTER.GOOD);

      game.fix(goodComputer);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('sets fourth computer as overdue after the time to fix', () => {
      jest.advanceTimersByTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(2);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(0);
    });

    it('breaks fifth computer after the time of rest', () => {
      jest.advanceTimersByTime(timeOfRest);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(2);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('finishes the game after max overdue has been exceeded', () => {
      jest.advanceTimersByTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(3);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(0);
      expect(gameState().status).toBe(GAME_STATUS.FINISHED);
    });

    it('does nothing more after', () => {
      clearTimeout.mockClear();
      setTimeout.mockClear();

      jest.advanceTimersByTime(timeToFix * 100);

      expect(clearTimeout).not.toHaveBeenCalled();
      expect(setTimeout).not.toHaveBeenCalled();
    });
  });

  describe('next level flow', () => {
    beforeAll(() => {
      game = createGame();
    });

    afterAll(() => {
      game.destroy();
    });

    it('has level 1 after start', () => {
      game.start();
      expect(gameState().level).toBe(1);
    });

    it('still runs the game when all computers fixed', () => {
      let count = gameState().board.fieldsCount;

      while (count--) {
        jest.advanceTimersByTime(timeOfRest);

        game.fix(findComputer(COMPUTER.BAD));
      }

      expect(gameState().status).toBe(GAME_STATUS.RUNNING);
    });

    it('finishes the level after the time of rest', () => {
      jest.advanceTimersByTime(timeOfRest);

      expect(gameState().status).toBe(GAME_STATUS.LEVEL_COMPLETED);
    });

    it('increases level when started again', () => {
      game.start();

      expect(gameState().level).toBe(2);
    });
  });
});
