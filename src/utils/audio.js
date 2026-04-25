// Web Audio API Sound Effects
const playSound = (freq, type, duration) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playSuccess = () => {
  playSound(523.25, 'sine', 0.5); // C5
  setTimeout(() => playSound(659.25, 'sine', 0.8), 100); // E5
};

export const playFailure = () => {
  playSound(150, 'sawtooth', 0.5); // Low Buzz
};

// Ambient Music Tracks (Royalty Free / Open Source)
export const musicTracks = [
  { id: 'lofi', label: 'Lofi Focus', url: 'https://p.scdn.co/mp3-preview/26e3c33083652614b7454be2e04f0394025176ca?cid=null' },
  { id: 'rain', label: 'Rain Ambient', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }, // Placeholder for loop
];
