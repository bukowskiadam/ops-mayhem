import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import style from './Game.module.css';
import commonStyle from './common.module.css';
import { Board } from './Board';
import {
  COMPUTER,
  GAME_STATUS,
  Game as GameEngine,
  LevelGenerator,
} from './gameEngine';
import { useAnimationFrame } from './useAnimationFrame';

export const Game = ({ gameLevel }) => {
  const game = useRef(null);
  const [points, setPoints] = useState(0);
  const [fields, setFields] = useState(null);
  const [boardSize, setBoardSize] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [level, setLevel] = useState(null);
  const [overduesLeft, setOverduesLeft] = useState(null);

  const startNextLevel = () => {
    game.current.start();

    const { boardSize, status, level, maxOverdue } = game.current.getState();
    setBoardSize(boardSize);
    setGameStatus(status);
    setLevel(level);
    setOverduesLeft(maxOverdue);
  };

  useEffect(
    () => {
      game.current = GameEngine({
        levelGenerator: LevelGenerator.PREDEFINED[gameLevel](),
      });

      startNextLevel();
    },
    [gameLevel],
  );

  const updateGame = useCallback(() => {
    const { board, points, status, maxOverdue } = game.current.getState();

    setFields(board.getFields());
    setPoints(Math.floor(points));
    setGameStatus(status);
    setOverduesLeft(maxOverdue - board.count(COMPUTER.OVERDUE));
  }, []);

  useAnimationFrame(updateGame);

  return (
    <div>
      <div className={ style.level }>Reorg: { level }</div>
      <div className={ style.points }>Saved: { points } NOK</div>
      {
        fields !== null && gameStatus === GAME_STATUS.RUNNING &&
        <Board
          fields={ fields }
          size={ boardSize }
          onFieldClick={ game.current.fix }
        />
      }
      {
        overduesLeft !== null && gameStatus === GAME_STATUS.RUNNING &&
        <div className={ style.overdue }>
          overdues left:
          <br />
          { overduesLeft
            ? new Array(overduesLeft).fill('X').join(' ')
            : '-'
          }
        </div>
      }
      {
        gameStatus === GAME_STATUS.LEVEL_COMPLETED &&
        <div>
          Level completed!
          <button
            className={ commonStyle.button }
            onClick={ startNextLevel }>
            continue
          </button>
        </div>
      }
      {
        gameStatus === GAME_STATUS.FINISHED &&
        <div>GAME OVER!</div>
      }
    </div>
  );
};

Game.propTypes = {
  gameLevel: PropTypes.string.isRequired,
};
