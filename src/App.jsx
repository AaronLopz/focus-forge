import React, { useState, useEffect } from 'react';
import './App.css';
import Mascot from './components/Mascot';
import useFocusTimer from './hooks/useFocusTimer';
import { translations } from './utils/translations';

const Logo = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" stroke="var(--primary)" strokeWidth="2" strokeDasharray="10 5" />
    <path d="M30 70 L50 30 L70 70" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 55 L60 55" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="30" r="5" fill="var(--secondary)" className="animate-pulse-glow" />
  </svg>
);

const subjects = [
  { id: 'general', label: { en: 'Original', es: 'Original' }, icon: '🤖' },
  { id: 'math', label: { en: 'Math-Bot', es: 'Mates-Bot' }, icon: '🔢' },
  { id: 'science', label: { en: 'Science-Probe', es: 'Sonda-Ciencia' }, icon: '🛸' },
  { id: 'languages', label: { en: 'Translator', es: 'Traductor' }, icon: '🌐' },
  { id: 'literature', label: { en: 'Librarian', es: 'Bibliotecario' }, icon: '📜' }
];

function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [sessionMins, setSessionMins] = useState(25);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const { secondsLeft, isActive, status, startTimer, resetTimer, setSecondsLeft } = useFocusTimer(sessionMins);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('focus_history') || '[]'));
  }, [status]);

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
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Logo />
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              {t.title}
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', letterSpacing: '1px' }}>{t.subtitle}</p>
          </div>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          className="glass-card"
          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}
        >
          {lang === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </button>
      </header>

      <div style={{ width: '100%', display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1', minWidth: '250px', padding: '1rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>{t.timeLabel}</label>
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
              {s.icon} {s.label[lang]}
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
                {status === 'broken' ? t.tryAgainBtn : t.startBtn}
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
                {t.giveUpBtn}
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
          <h2 style={{ marginBottom: '0.5rem' }}>{t.brokenTitle}</h2>
          <p>{t.brokenDesc}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="alert glass-card" style={{ 
          color: '#10b981', 
          border: '1px solid #10b981',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '0.5rem' }}>{t.successTitle}</h2>
          <p>{t.successDesc}</p>
        </div>
      )}

      <section className="explanation-section" style={{ marginTop: '4rem', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-dim)' }}>{t.howItWorks}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { step: '01', title: t.step1Title, desc: t.step1Desc },
            { step: '02', title: t.step2Title, desc: t.step2Desc },
            { step: '03', title: t.step3Title, desc: t.step3Desc }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', opacity: '0.3' }}>{item.step}</div>
              <h4 style={{ margin: '0.5rem 0', color: 'var(--text-main)' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="glass-card" style={{ width: '100%', marginTop: '2rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.8rem', background: 'var(--primary)', borderRadius: '50%', color: 'var(--bg-deep)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem' }}>{lang === 'en' ? 'Focus Radio' : 'Radio de Enfoque'}</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{lang === 'en' ? 'Ambient sounds for deep work' : 'Sonidos ambientales para trabajar'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <audio id="ambient-audio" loop crossOrigin="anonymous">
            <source src="https://stream.zeno.fm/f36p873hb8hvu" type="audio/mpeg" />
          </audio>
          <button 
            id="play-button"
            onClick={() => {
              const audio = document.getElementById('ambient-audio');
              const btn = document.getElementById('play-button');
              if (audio.paused) {
                audio.play().then(() => {
                  audio.volume = 0.4;
                  btn.innerText = lang === 'en' ? 'STOP MUSIC' : 'PARAR MÚSICA';
                  btn.style.background = 'var(--accent)';
                }).catch(e => console.error("Error playing audio:", e));
              } else {
                audio.pause();
                btn.innerText = lang === 'en' ? 'PLAY LOFI' : 'REPRODUCIR LOFI';
                btn.style.background = 'var(--primary)';
              }
            }}
            className="glass-card"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', fontWeight: 'bold', background: 'var(--primary)', color: 'var(--bg-deep)', minWidth: '140px' }}
          >
            {lang === 'en' ? 'PLAY LOFI' : 'REPRODUCIR LOFI'}
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ width: '100%', marginTop: '1rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>{t.statsTitle}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{t.statsSubtitle}</span>
        </div>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>{t.sessions}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{history.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px' }}>{t.totalMins}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {history.reduce((acc, curr) => acc + curr.duration, 0)}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '4rem', paddingBottom: '2rem', color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center' }}>
        {t.footer}
      </footer>
    </div>
  );
}

export default App;
