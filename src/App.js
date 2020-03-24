import React, { useState } from 'react';

import style from './App.module.css';
import commonStyle from './common.module.css';
import { Game } from './Game';
import { LevelGenerator } from './gameEngine';

import giftImage from './assets/gift.jpg';

export const App = () => {
  const [showWishes, setWishes] = useState(true);
  const [gameLevel, setGameLevel] = useState(null);

  let content;

  if (showWishes) {
    content = (
      <div>
        <p>Happy birthday Filip!</p>
        <p>We wish you all the best!</p>
        <p><img className={style.gift} src={giftImage} alt="Gift in the office" /></p>
        <p className={style.giftText}>
          <span role="img" aria-label="point uo">👆🏻</span>
          This is your gift waiting<br />in the office to pick up.
          <br />Happy sawing!
        </p>
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
        <p>Be the ops guy now!</p>
        <p>You have to make sure our servers work properly.</p>
        <p>
          If it blinks red it's bad server. You can fix it by click.
          You save Schibsted's money for fixing bad computers ASAP.
          After some time bad computers turns into overdue fix.
          You won't get NOKs for them anymore but the game is over if you have
          too many of them.
        </p>
        <p>Keep an eye on our infra and good luck!</p>
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
