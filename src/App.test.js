import React from 'react';
import { render } from '@testing-library/react';
import { App } from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const wishesElement = getByText(/Happy birthday Filip/i);
  expect(wishesElement).toBeInTheDocument();
});
