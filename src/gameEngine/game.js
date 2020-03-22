import { COMPUTER, GAME_STATUS } from './consts';
import { makeBoard } from './utils';

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
    state.board[0][0] = COMPUTER.BAD;
  };

  const run = () => {
    state.status = GAME_STATUS.RUNNING;
    state.boardSize = internalState.boardSize;
    state.board = makeBoard(internalState.boardSize, COMPUTER.GOOD);

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
