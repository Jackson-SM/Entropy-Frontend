import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'entropy_focus_mode';

export function useFocusMode() {
  const [focusMode, setFocusModeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const setFocusMode = useCallback((value: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(value));
    setFocusModeState(value);
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode(!focusMode);
  }, [focusMode, setFocusMode]);

  return { focusMode, setFocusMode, toggleFocusMode };
}
