import { COMPUTER, GAME_STATUS } from './consts';
import { Board } from './board';
import { randomBreakOrder } from './breakOrder';

export const Game = ({
  levelGenerator,
}) => {
  const state = {
    level: 0,
    status: GAME_STATUS.NOT_STARTED,
    boardSize: null,
    board: null,
  };

  let levelParams;
  let currentTimeout;
  let currentComputer;
  let breakOrder;

  const setCurrentOverdue = () => {
    state.board.setField(currentComputer, COMPUTER.OVERDUE);

    if (state.board.count(COMPUTER.OVERDUE) > levelParams.maxOverdue) {
      destroy();
      state.status = GAME_STATUS.FINISHED;
    } else {
      currentTimeout = setTimeout(breakNextComputer, levelParams.timeOfRest);
    }
  };

  const breakNextComputer = () => {
    const next = breakOrder.next();

    if (!next.done) {
      currentComputer = next.value;

      state.board.setField(currentComputer, COMPUTER.BAD);

      currentTimeout = setTimeout(setCurrentOverdue, levelParams.timeToFix);
    } else {
      state.status = GAME_STATUS.LEVEL_COMPLETED;
    }
  };

  const start = () => {
    state.level = state.level + 1;
    state.status = GAME_STATUS.RUNNING;

    levelParams = levelGenerator.make(state.level);
    state.boardSize = levelParams.boardSize;
    state.board = Board(levelParams.boardSize, COMPUTER.GOOD);
    breakOrder = randomBreakOrder(state.board.fieldsCount);

    currentTimeout = setTimeout(breakNextComputer, levelParams.timeOfRest);
  };

  const fix = (computer) => {
    state.board.setField(computer, COMPUTER.GOOD);

    if (currentComputer === computer) {
      clearTimeout(currentTimeout);

      currentTimeout = setTimeout(breakNextComputer, levelParams.timeOfRest);
    }
  };

  const getState = () => state;

  const destroy = () => {
    clearTimeout(currentTimeout);
  };

  return {
    start,
    fix,
    getState,
    destroy,
  };
};
