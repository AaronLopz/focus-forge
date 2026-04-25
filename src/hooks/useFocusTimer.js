import { useState, useEffect, useRef } from 'react';

const useFocusTimer = (initialMinutes = 25) => {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, focusing, broken, success
  const timerRef = useRef(null);

  const startTimer = () => {
    setIsActive(true);
    setStatus('focusing');
  };

  const resetTimer = (isFailure = false) => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setSecondsLeft(initialMinutes * 60);
    setStatus(isFailure ? 'broken' : 'idle');
  };

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(timerRef.current);
      setIsActive(false);
      setStatus('success');
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, secondsLeft]);

  useEffect(() => {
    const handlePenalty = () => {
      if (isActive) {
        resetTimer(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handlePenalty();
      }
    };

    const handleBlur = () => {
      handlePenalty();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isActive]);

  // Handle session success
  useEffect(() => {
    if (status === 'success') {
      const history = JSON.parse(localStorage.getItem('focus_history') || '[]');
      history.push({
        date: new Date().toISOString(),
        duration: initialMinutes
      });
      localStorage.setItem('focus_history', JSON.stringify(history));
    }
  }, [status, initialMinutes]);

  return {
    secondsLeft,
    isActive,
    status,
    startTimer,
    resetTimer,
    setSecondsLeft: (mins) => setSecondsLeft(mins * 60)
  };
};

export default useFocusTimer;
