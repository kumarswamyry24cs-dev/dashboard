import { useState, useCallback } from 'react';

// Create beep sound using Web Audio API
const createBeep = (frequency = 800, duration = 100) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
};

const useSoundEffects = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playBeep = useCallback(() => {
    if (soundEnabled) {
      createBeep(800, 100);
    }
  }, [soundEnabled]);

  const playAlert = useCallback(() => {
    if (soundEnabled) {
      createBeep(600, 200);
      setTimeout(() => createBeep(400, 200), 150);
    }
  }, [soundEnabled]);

  const playSuccess = useCallback(() => {
    if (soundEnabled) {
      createBeep(800, 100);
      setTimeout(() => createBeep(1000, 100), 100);
      setTimeout(() => createBeep(1200, 150), 200);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return {
    soundEnabled,
    playBeep,
    playAlert,
    playSuccess,
    toggleSound
  };
};

export default useSoundEffects;
