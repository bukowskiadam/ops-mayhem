import React, { useState } from 'react';

import style from './App.module.css';
import commonStyle from './common.module.css';
import { Game } from './Game';
import { LevelGenerator } from './gameEngine';

export const App = () => {
  const [showWishes, setWishes] = useState(true);
  const [gameLevel, setGameLevel] = useState(null);

  let content;

  if (showWishes) {
    content = (
      <div>
        <p>Happy birthday Filip!</p>
        <p>We wish you all the best!</p>
        <button
          className={ commonStyle.button }
          onClick={ () => setWishes(false) }
        >
          Thanks! let's play
        </button>
      </div>
    )
  } else if (!gameLevel) {
    content = (
      <div>
        <p>Select level:</p>
        {
          Object.keys(LevelGenerator.PREDEFINED).map(
            predefinedLevel => (
              <button
                className={ commonStyle.button }
                key={ predefinedLevel }
                onClick={ () => setGameLevel(predefinedLevel) }
              >{ predefinedLevel }</button>
            ),
          )
        }
      </div>
    );
  } else {
    content = <Game gameLevel={ gameLevel } />
  }

  return (
    <div className={ style.root }>
      <div className={ style.container }>
        { content }
      </div>
    </div>
  );
};
