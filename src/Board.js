import React from 'react';
import PropTypes from 'prop-types';
import style from './Board.module.css';
import { COMPUTER } from './gameEngine';

const classMap = {
  [COMPUTER.GOOD]: 'good',
  [COMPUTER.BAD]: 'bad',
  [COMPUTER.OVERDUE]: 'overdue',
};

const mapComputerToClassName = (computer) => `${ style.computer } ${ style[classMap[computer]] }`;

export const Board = ({ size, fields, onFieldClick }) => (
  <div
    className={ style.board }
    style={ {
      gridTemplateColumns: `repeat(${ size }, 1fr)`,
      gridTemplateRows: `repeat(${ size }, 1fr)`,
    } }
  >
    {
      fields.map((computer, index) => (
        <div
          key={ index }
          className={ mapComputerToClassName(computer) }
          onClick={ () => onFieldClick(index) }
        />
      ))
    }
  </div>
);

Board.propTypes = {
  size: PropTypes.number.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFieldClick: PropTypes.func.isRequired,
};
