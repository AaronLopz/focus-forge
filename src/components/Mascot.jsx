import React from 'react';

const Mascot = ({ state = 'idle', subject = 'general' }) => {
  const isBroken = state === 'broken';
  const isFocusing = state === 'focusing';
  const isSuccess = state === 'success';

  // Helper for expressions across different robots
  const getEyeColor = () => (isBroken ? '#f43f5e' : isSuccess ? '#10b981' : isFocusing ? 'var(--primary)' : 'white');

  const renderMathRobot = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Boxy, Calculator-like body */}
      <rect x="20" y="20" width="60" height="70" rx="4" fill="#334155" stroke="var(--primary)" strokeWidth="2" />
      <rect x="25" y="25" width="50" height="30" rx="2" fill="#0f172a" stroke="var(--glass-border)" />
      {/* Grid eyes */}
      <rect x="30" y="30" width="10" height="10" fill={getEyeColor()} opacity={isFocusing ? 1 : 0.6} />
      <rect x="60" y="30" width="10" height="10" fill={getEyeColor()} opacity={isFocusing ? 1 : 0.6} />
      {/* Numpad belly */}
      <g opacity="0.4">
        {[0, 1, 2].map(i => [0, 1, 2].map(j => (
          <rect key={`${i}-${j}`} x={35 + j * 10} y={65 + i * 8} width="6" height="5" rx="1" fill="var(--text-dim)" />
        )))}
      </g>
      {isBroken && <path d="M40 50 L60 40 M40 40 L60 50" stroke="#f43f5e" strokeWidth="2" />}
    </svg>
  );

  const renderScienceRobot = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Floating Probe Style */}
      <circle cx="50" cy="50" r="35" fill="rgba(16, 185, 129, 0.1)" stroke="var(--primary)" strokeWidth="2" />
      <circle cx="50" cy="50" r="25" fill="#0f172a" stroke="var(--primary)" strokeWidth="1" />
      {/* Core Eye */}
      <circle cx="50" cy="50" r={isFocusing ? 12 : 8} fill={getEyeColor()}>
        {isFocusing && <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />}
      </circle>
      {/* Orbital Rings */}
      <ellipse cx="50" cy="50" rx="45" ry="15" stroke="var(--primary)" strokeWidth="1" opacity="0.3" transform="rotate(45 50 50)" />
      <ellipse cx="50" cy="50" rx="45" ry="15" stroke="var(--primary)" strokeWidth="1" opacity="0.3" transform="rotate(-45 50 50)" />
    </svg>
  );

  const renderLiteratureRobot = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Steampunk / Vintage Librarian Style */}
      <path d="M25 80 Q50 90 75 80 V40 Q50 30 25 40 Z" fill="#451a03" stroke="#92400e" strokeWidth="2" />
      <rect x="35" y="20" width="30" height="25" rx="15" fill="#92400e" />
      {/* Monocle Eye */}
      <circle cx="40" cy="50" r="6" fill={getEyeColor()} />
      <circle cx="60" cy="50" r="6" fill={getEyeColor()} />
      <circle cx="40" cy="50" r="9" stroke="#b45309" strokeWidth="2" />
      <line x1="49" y1="50" x2="55" y2="45" stroke="#b45309" strokeWidth="1" />
      {/* Pages coming out */}
      <path d="M40 85 Q50 75 60 85" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
    </svg>
  );

  const renderLanguagesRobot = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Multi-module / Translator Style */}
      <rect x="30" y="30" width="40" height="40" rx="10" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
      <circle cx="30" cy="30" r="12" fill="#312e81" stroke="#818cf8" strokeWidth="1" />
      <circle cx="70" cy="30" r="12" fill="#312e81" stroke="#818cf8" strokeWidth="1" />
      <circle cx="30" cy="70" r="12" fill="#312e81" stroke="#818cf8" strokeWidth="1" />
      <circle cx="70" cy="70" r="12" fill="#312e81" stroke="#818cf8" strokeWidth="1" />
      {/* Central Display */}
      <text x="50" y="55" fontSize="12" fill={getEyeColor()} textAnchor="middle" fontWeight="bold">
        {isBroken ? 'ERR' : isSuccess ? 'OK' : 'A/あ'}
      </text>
    </svg>
  );

  const renderGeneralRobot = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="80" height="65" rx="20" fill="var(--bg-slate)" stroke="var(--glass-border)" strokeWidth="2" />
      <line x1="50" y1="20" x2="50" y2="5" stroke="var(--text-dim)" strokeWidth="3" />
      <circle cx="50" cy="5" r="4" fill={isFocusing ? 'var(--primary)' : 'var(--text-dim)'} />
      <circle cx="32" cy="42" r="6" fill={getEyeColor()} />
      <circle cx="68" cy="42" r="6" fill={getEyeColor()} />
      <rect x="40" y="65" width="20" height="2" rx="1" fill="var(--text-dim)" />
    </svg>
  );

  const getRobot = () => {
    switch (subject) {
      case 'math': return renderMathRobot();
      case 'science': return renderScienceRobot();
      case 'literature': return renderLiteratureRobot();
      case 'languages': return renderLanguagesRobot();
      default: return renderGeneralRobot();
    }
  };

  return (
    <div className={`mascot-container ${isBroken ? 'animate-shake' : 'animate-float'}`} style={{ width: '200px', height: '200px' }}>
      {getRobot()}
    </div>
  );
};

export default Mascot;
