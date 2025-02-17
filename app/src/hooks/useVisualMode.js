import { useState } from 'react';

export const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    setMode(newMode);
    if (!replace) {
      setHistory((cur) => [...cur, newMode]);
    }
  };

  const back = () => {
    const copy = [...history];
    copy.pop();
    if (copy.length >= 1) {
      setHistory(copy);
      const last = copy.slice(-1)[0];
      setMode(last);
    }
  };

  return { mode, transition, back };
};
