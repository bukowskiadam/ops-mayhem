import { Game } from './game.js';
import { COMPUTER, GAME_STATUS } from './consts';

jest.useFakeTimers();

describe('Game', () => {
  let game;

  const timeOfRest = 1000;
  const timeToFix = 3000;
  const boardSize = 3;
  const maxOverdue = 2;
  const pointsMultipler = 1;

  const levelGenerator = {
    make: jest.fn().mockReturnValue({
      timeOfRest,
      timeToFix,
      boardSize,
      maxOverdue,
      pointsMultipler,
    }),
  };

  let currentTime = 0;
  const now = jest.fn().mockReturnValue(currentTime);

  const createGame = () => Game({
    levelGenerator,
    now,
  });

  const advanceTime = (timeMs) => {
    currentTime += timeMs;
    now.mockReturnValue(currentTime);

    jest.advanceTimersByTime(timeMs);
  };

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
        status: GAME_STATUS.NOT_STARTED,
        board: null,
        boardSize: null,
        level: 0,
        points: 0,
        maxOverdue: 0,
      });
    });

    it('returns correct game state after game is started', () => {
      game.start();

      expect(gameState().status).toBe(GAME_STATUS.RUNNING);
      expect(gameState().boardSize).toBe(boardSize);
    });

    it('starts the game with board of only good computers', () => {
      expectBoardOnlyOf(COMPUTER.GOOD);
    });

    it('breaks first computer after the time of rest', () => {
      advanceTime(timeOfRest + 10);

      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('allows to fix first broken computer just once', () => {
      const badComputer = findComputer(COMPUTER.BAD);
      game.fix(badComputer);

      expectBoardOnlyOf(COMPUTER.GOOD);

      advanceTime(timeOfRest - 10);
      game.fix(badComputer);
    });

    it('breaks second computer after the time of rest', () => {
      advanceTime(10);

      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('sets second computer as overdue after the time to fix', () => {
      advanceTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
    });

    it('allows to fix overdue computer but breaks third computer', () => {
      advanceTime(timeOfRest / 2);

      game.fix(findComputer(COMPUTER.OVERDUE));
      advanceTime(timeOfRest / 2);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(0);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('allows to fix overdue computer but time for bad goes on', () => {
      game.fix(findComputer(COMPUTER.OVERDUE));

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(0);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);

      advanceTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(0);
    });

    it('breaks fourth computer after the time of rest', () => {
      advanceTime(timeOfRest);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('does nothing if you try to fix good computer', () => {
      game.fix(findComputer(COMPUTER.GOOD));

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(1);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('sets fourth computer as overdue after the time to fix', () => {
      advanceTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(2);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(0);
    });

    it('breaks fifth computer after the time of rest', () => {
      advanceTime(timeOfRest);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(2);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(1);
    });

    it('finishes the game after max overdue has been exceeded', () => {
      advanceTime(timeToFix);

      expect(gameState().board.count(COMPUTER.OVERDUE)).toBe(3);
      expect(gameState().board.count(COMPUTER.BAD)).toBe(0);
      expect(gameState().status).toBe(GAME_STATUS.FINISHED);
    });

    it('does nothing more after', () => {
      clearTimeout.mockClear();
      setTimeout.mockClear();

      advanceTime(timeToFix * 100);

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
        advanceTime(timeOfRest);

        game.fix(findComputer(COMPUTER.BAD));
      }

      expect(gameState().status).toBe(GAME_STATUS.RUNNING);
    });

    it('finishes the level after the time of rest', () => {
      advanceTime(timeOfRest);

      expect(gameState().status).toBe(GAME_STATUS.LEVEL_COMPLETED);
    });

    it('increases level when started again', () => {
      levelGenerator.make.mockClear();

      game.start();

      expect(gameState().level).toBe(2);
      expect(levelGenerator.make).toHaveBeenCalledWith(2);
    });
  });

  describe('next level flow', () => {
    let points = 0;

    beforeAll(() => {
      game = createGame();
    });

    afterAll(() => {
      game.destroy();
    });

    it('starts the game with 0 points', () => {
      game.start();

      expect(gameState().points).toBe(points);
    });

    it('counts full points for a fixed bad computer', () => {
      advanceTime(timeOfRest);

      game.fix(findComputer(COMPUTER.BAD));
      points += timeToFix;

      expect(gameState().points).toBe(points);
    });

    it('counts partial points for a fixed bad computer', () => {
      const delayTime = 400;

      advanceTime(timeOfRest);
      advanceTime(delayTime);

      game.fix(findComputer(COMPUTER.BAD));
      points += (timeToFix - delayTime);

      expect(gameState().points).toBe(points);
    });

    it('does not count points for a fixed overdue computer', () => {
      advanceTime(timeOfRest);
      advanceTime(timeToFix);
      advanceTime(100);

      game.fix(findComputer(COMPUTER.OVERDUE));

      expect(gameState().points).toBe(points);
    });
  });
});
