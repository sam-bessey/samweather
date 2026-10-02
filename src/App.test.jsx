import { expect, test } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

test('renders app without crashing and sets the page title', () => {
    render(<App />);
    expect(document.title).toBe("SamWeather");
});
