import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { useIsMobile } from '../use-mobile';

describe('useIsMobile', () => {
  let addEventListenerMock: Mock;
  let removeEventListenerMock: Mock;
  let matchMediaMock: Mock;

  beforeEach(() => {
    // Setup mocks
    addEventListenerMock = vi.fn();
    removeEventListenerMock = vi.fn();
    matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return false by default (desktop)', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)');
  });

  it('should return true if window.innerWidth is less than 768', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should add and remove event listeners', () => {
    const { unmount } = renderHook(() => useIsMobile());
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should update isMobile when change event is fired', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    // Extract the registered onChange handler
    const onChangeCallback = addEventListenerMock.mock.calls[0][1];

    act(() => {
      onChangeCallback();
    });

    expect(result.current).toBe(true);
  });
});
