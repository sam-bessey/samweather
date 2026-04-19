import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app headline', () => {
  render(<App />);
  const headline = screen.getByText(/react \+ tailwind/i);
  expect(headline).toBeDefined();
});
