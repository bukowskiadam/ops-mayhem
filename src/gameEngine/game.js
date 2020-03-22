import { COMPUTER, GAME_STATUS } from './consts';
import { Board } from './board';
import { randomBreakOrder } from './breakOrder';

export const Game = ({
  timeOfRest,
  boardSize,
}) => {
  const internalState = {
    timeOfRest,
    boardSize,
  };

  const state = {
    status: GAME_STATUS.NOT_STARTED,
    boardSize,
    board: null,
  };

  let currentTimeout;

  const breakNextComputer = () => {
    const next = internalState.breakOrder.next();

    if (!next.done) {
      state.board.setField(next.value, COMPUTER.BAD);
    }
  };

  const run = () => {
    state.status = GAME_STATUS.RUNNING;
    state.boardSize = internalState.boardSize;
    state.board = Board(internalState.boardSize, COMPUTER.GOOD);
    internalState.breakOrder = randomBreakOrder(state.board.fieldsCount);

    currentTimeout = setTimeout(breakNextComputer, internalState.timeOfRest);
  };

  const action = () => {
    throw new Error('To be implemented');
  };

  const getState = () => state;

  const destroy = () => {
    clearTimeout(currentTimeout);
  };

  return {
    run,
    action,
    getState,
    destroy,
  };
};
