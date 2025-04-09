import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For the "toBeInTheDocument" matcher
import '@testing-library/jest-dom';
import DarkToggle from '../DarkToggle';

test('renders DarkToggle component', () => {
  const mockHandleChange = jest.fn();

  render(<DarkToggle isChecked={true} handleChange={mockHandleChange} />);

  // Check if the component renders the correct toggle button and label
  expect(screen.getByLabelText("Dark Mode")).toBeInTheDocument();
});