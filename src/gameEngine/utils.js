export const countComputers = (
  board,
  computerStatus,
) => board.flat().filter(computer => computer === computerStatus).length;

export const makeBoard = (size, state) => {
  let board = new Array(size).fill(undefined);

  return board.map(() => new Array(size).fill(state));
};
