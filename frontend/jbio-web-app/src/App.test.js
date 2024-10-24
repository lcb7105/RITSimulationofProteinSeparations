import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the useLocalStorage hook
jest.mock('usehooks-ts', () => ({
  useLocalStorage: jest.fn(),
}));


describe('App', () => {
  beforeEach(() => {
    // Reset the mock between tests
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(query => {
      return {
        matches: query === "(prefers-color-scheme: dark)", // Simulate dark mode if needed
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });
  });

  test('renders correctly with sidebar open', () => {
    // Mock the useLocalStorage hook to return true for isSidebarOpen
    require('usehooks-ts').useLocalStorage.mockReturnValue([true, jest.fn()]);

    render(<App />);

    // Check if the sidebar is rendered
    expect(screen.getByTestId('about-text')).toBeInTheDocument();
    expect(screen.getByText('1D Electrophoresis')).toBeInTheDocument();
    expect(screen.getByText('2D Electrophoresis')).toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Github')).toBeInTheDocument();

    // Check if the Router component is rendered
    //expect(screen.getByText('This is the Router component.')).toBeInTheDocument();
  });

  
  test('renders correctly with sidebar closed', () => {
    // Mock the useLocalStorage hook to return false for isSidebarOpen
    require('usehooks-ts').useLocalStorage.mockReturnValue([false, jest.fn()]);

    render(<App />);

    // Check if the sidebar is not rendered
    expect(screen.queryByTestId('about-text')).not.toBeInTheDocument();
    expect(screen.queryByText('1D Electrophoresis')).not.toBeInTheDocument();
    expect(screen.queryByText('2D Electrophoresis')).not.toBeInTheDocument();
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
    expect(screen.queryByText('Contact')).not.toBeInTheDocument();
    expect(screen.queryByText('Github')).not.toBeInTheDocument();

    // Check if the Router component is rendered
    //expect(screen.getByText('This is the Router component.')).toBeInTheDocument();
  });

  
  // test('toggles sidebar open/close correctly', () => {
  //   // Mock the useLocalStorage hook
  //   const setLocalStorage = jest.fn();
  //   require('usehooks-ts').useLocalStorage.mockReturnValue([true, setLocalStorage]);

  //   render(<App />);

  //   // Check if the sidebar is initially open
  //   expect(screen.getByTestId('about-text')).toBeInTheDocument();

  //   // Click on the toggle button to close the sidebar
  //   fireEvent.click(screen.getByRole('button', { name: 'toggle-btn' }));
    
  //   // Check if the setLocalStorage function is called with the correct value
  //   expect(setLocalStorage).toHaveBeenCalledWith(false);

  //   // Check if the sidebar is closed
  //   expect(screen.getByTestId('about-text')).not.toBeInTheDocument();

  //   // Click on the toggle button to open the sidebar
  //   fireEvent.click(screen.getByRole('button', { class: 'toggle-btn' }));
    
  //   // Check if the setLocalStorage function is called with the correct value
  //   expect(setLocalStorage).toHaveBeenCalledWith(true);

  //   // Check if the sidebar is open
  //   expect(screen.getByTestId('about-text')).toBeInTheDocument();
  // });
}); 
