import React, { useState, useEffect } from 'react';
import './App.css';
import Mascot from './components/Mascot';
import useFocusTimer from './hooks/useFocusTimer';

const Logo = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="var(--primary)" strokeWidth="2" strokeDasharray="10 5" />
    <path d="M30 70 L50 30 L70 70" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 55 L60 55" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="30" r="5" fill="var(--secondary)" className="animate-pulse-glow" />
  </svg>
);

const subjects = [
  { id: 'general', label: 'Original', icon: '🤖' },
  { id: 'math', label: 'Math-Bot', icon: '🔢' },
  { id: 'science', label: 'Science-Probe', icon: '🛸' },
  { id: 'languages', label: 'Translator', icon: '🌐' },
  { id: 'literature', label: 'Librarian', icon: '📜' }
];

function App() {
  const [sessionMins, setSessionMins] = useState(25);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const { secondsLeft, isActive, status, startTimer, resetTimer, setSecondsLeft } = useFocusTimer(sessionMins);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('focus_history') || '[]'));
  }, [status]);

  // Sync time if not active
  useEffect(() => {
    if (!isActive) {
      setSecondsLeft(sessionMins);
    }
  }, [sessionMins, isActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionMins * 60 - secondsLeft) / (sessionMins * 60)) * 100;

  return (
    <div className="app-container" style={{ maxWidth: '900px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <Logo />
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            FocusForge
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '1px' }}>REFORGING YOUR CONCENTRATION</p>
        </div>
      </header>

      <div style={{ width: '100%', display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1', minWidth: '250px', padding: '1rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>TIME (MINUTES)</label>
          <input 
            type="number" 
            value={sessionMins} 
            onChange={(e) => setSessionMins(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={isActive}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-main)', 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
        <div className="glass-card" style={{ flex: '2', minWidth: '300px', padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', overflowX: 'auto' }}>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(s.id)}
              disabled={isActive}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                background: selectedSubject === s.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: selectedSubject === s.id ? 'var(--bg-deep)' : 'var(--text-main)',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                fontWeight: 'bold',
                opacity: isActive && selectedSubject !== s.id ? '0.5' : '1'
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      <main className="glass-card" style={{ width: '100%', display: 'flex', gap: '3rem', alignItems: 'center', padding: '3rem' }}>
        <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
          <Mascot state={status} subject={selectedSubject} />
        </div>

        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontSize: '5rem', fontWeight: '800', fontFamily: 'monospace', color: status === 'broken' ? 'var(--accent)' : 'var(--text-main)' }}>
              {formatTime(secondsLeft)}
            </div>
            
            <div className="progress-container" style={{ marginTop: '1rem' }}>
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="controls" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {!isActive ? (
              <button 
                onClick={startTimer}
                className="glass-card neon-glow" 
                style={{ 
                  padding: '1rem 4rem', 
                  background: 'var(--primary)', 
                  color: 'var(--bg-deep)', 
                  fontWeight: '800',
                  fontSize: '1.1rem'
                }}
              >
                {status === 'broken' ? 'TRY AGAIN' : 'START SESSION'}
              </button>
            ) : (
              <button 
                onClick={() => resetTimer(false)}
                className="glass-card" 
                style={{ 
                  padding: '1rem 3rem', 
                  background: 'transparent', 
                  color: 'var(--accent)', 
                  border: '1px solid var(--accent)',
                  fontWeight: 'bold'
                }}
              >
                GIVE UP
              </button>
            )}
          </div>
        </div>
      </main>

      {status === 'broken' && (
        <div className="alert glass-card" style={{ 
          color: 'var(--accent)', 
          border: '1px solid var(--accent)',
          marginTop: '2rem',
          textAlign: 'center',
          animation: 'shake 0.5s ease-in-out'
        }}>
          <h2 style={{ marginBottom: '0.5rem' }}>⚠️ FOCUS BROKEN</h2>
          <p>The tab was switched. The Guardian has reset your progress. You must stay in the forge to succeed.</p>
        </div>
      )}

      <section className="explanation-section" style={{ marginTop: '4rem', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-dim)' }}>How the Forge Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { step: '01', title: 'Start Focus', desc: 'Initiate a custom deep work session.' },
            { step: '02', title: 'Zero Distractions', desc: 'If you leave the tab, the Guardian resets everything.' },
            { step: '03', title: 'Forge Success', desc: 'Complete the session to earn stats and improve focus.' }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', opacity: '0.3' }}>{item.step}</div>
              <h4 style={{ margin: '0.5rem 0', color: 'var(--text-main)' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-card" style={{ width: '100%', marginTop: '3rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>Concentration Stats</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Stored locally</span>
        </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>SESSIONS</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{history.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>TOTAL MINS</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {history.reduce((acc, curr) => acc + curr.duration, 0)}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '4rem', paddingBottom: '2rem', color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center' }}>
        FOCUSFORGE v2.1 • BUILT FOR DEEP WORK PORTFOLIO
      </footer>
    </div>
  );
}

export default App;
