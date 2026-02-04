import React, { useState, useEffect } from 'react';

// --- QUOTES DATABASE ---
const QUOTES = [
  "Discipline is doing what you hate to do, but doing it like you love it.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "The pain of regret is far worse than the pain of discipline.",
  "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
  "Your competition isn't other people. It's your procrastination.",
  "If you want to be in the 1%, you have to do what the 99% won't.",
  "Don't stop when you're tired. Stop when you're done.",
  "A river cuts through rock, not because of its power, but because of its persistence.",
  "Focus is about saying no.",
  "The only bad workout is the one that didn't happen.",
  // ... (Repeats or adds more for 60 days)
];

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'tracker', 'motivation'
  const [currentDay, setCurrentDay] = useState(1);
  const [daysLeft, setDaysLeft] = useState(60);
  const [timeLeft, setTimeLeft] = useState(""); // HH:MM:SS string
  const [history, setHistory] = useState({});

  // --- LOGIC: Time Calculation & Storage ---
  useEffect(() => {
    const TOTAL_DAYS = 60;
    
    // 1. Handle Start Date
    let storedStart = localStorage.getItem('challengeStartDate');
    if (!storedStart) {
      storedStart = new Date().toISOString();
      localStorage.setItem('challengeStartDate', storedStart);
    }

    const startTimestamp = new Date(storedStart).getTime();

    // 2. Timer Loop (Updates every second)
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeElapsed = now - startTimestamp;
      
      // Calculate Day
      const dayIndex = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
      const currentDayNum = dayIndex + 1;
      
      setCurrentDay(currentDayNum);
      setDaysLeft(Math.max(0, TOTAL_DAYS - currentDayNum));

      // Calculate Time Remaining in Current Day
      const nextDayStart = startTimestamp + ((dayIndex + 1) * (1000 * 60 * 60 * 24));
      const msLeft = nextDayStart - now;

      const h = Math.floor((msLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((msLeft % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    // 3. Load History
    const storedHistory = JSON.parse(localStorage.getItem('studyHistory')) || {};
    setHistory(storedHistory);

    return () => clearInterval(timerInterval);
  }, []);

  const handleSave = (day, data) => {
    const newHistory = { ...history, [day]: data };
    setHistory(newHistory);
    localStorage.setItem('studyHistory', JSON.stringify(newHistory));
    alert(`Day ${day} Logged. Keep pushing.`);
  };

  const getQuote = () => {
    // Pick a quote based on the day number (cycling through if we run out)
    return QUOTES[(currentDay - 1) % QUOTES.length];
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {view === 'landing' && (
          <LandingPage 
            day={currentDay} 
            daysLeft={daysLeft} 
            timeLeft={timeLeft}
            onEnter={() => setView('tracker')}
            onMotivation={() => setView('motivation')}
          />
        )}
        
        {view === 'tracker' && (
          <TrackerPage 
            day={currentDay} 
            history={history} 
            onSave={handleSave}
            onBack={() => setView('landing')}
          />
        )}

        {view === 'motivation' && (
          <MotivationPage 
            quote={getQuote()} 
            day={currentDay}
            onBack={() => setView('landing')} 
          />
        )}
      </div>
    </div>
  );
}

// --- COMPONENT: Landing Page ---
const LandingPage = ({ day, daysLeft, timeLeft, onEnter, onMotivation }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-fade-in">
      
      <h1 className="text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 uppercase">
        The Last Days
      </h1>
      
      {/* Timer Box */}
      <div className="flex items-center gap-12 bg-neutral-900 border border-neutral-800 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Background pulsing glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>

        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 tracking-widest mb-2">CURRENT DAY</span>
          <span className="text-6xl font-bold text-white">{day}</span>
          {/* LIVE COUNTDOWN */}
          <span className="text-sm font-mono text-red-500 mt-2 bg-black/50 px-2 py-1 rounded border border-red-900/30">
            {timeLeft} left
          </span>
        </div>
        
        <div className="w-px h-24 bg-neutral-800"></div>

        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 tracking-widest mb-2">DAYS LEFT</span>
          <span className="text-6xl font-bold text-neutral-400">{daysLeft}</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Enter Button */}
        <button 
          onClick={onEnter}
          className="group relative px-8 py-4 bg-white text-black font-bold text-xl uppercase tracking-wider overflow-hidden rounded hover:scale-105 transition-transform duration-200"
        >
          <span className="relative z-10">Enter War Room</span>
          <div className="absolute inset-0 h-full w-full bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
        </button>

        {/* Motivation Button */}
        <button 
          onClick={onMotivation}
          className="px-6 py-4 border border-neutral-700 text-neutral-400 font-bold text-lg uppercase tracking-wider rounded hover:bg-neutral-900 hover:text-white transition-colors"
        >
          Protocol
        </button>
      </div>
    </div>
  );
};

// --- COMPONENT: Motivation Page (Minimalist) ---
const MotivationPage = ({ quote, day, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8 animate-fade-in-up">
      <span className="text-neutral-600 text-sm tracking-[0.3em] uppercase mb-12">
        Day {day} Protocol
      </span>
      
      <blockquote className="text-3xl md:text-4xl font-light text-white leading-relaxed max-w-2xl border-l-2 border-red-600 pl-8 text-left">
        "{quote}"
      </blockquote>

      <button 
        onClick={onBack}
        className="mt-20 text-neutral-500 hover:text-white text-sm tracking-widest uppercase transition-colors"
      >
        [ Return to Base ]
      </button>
    </div>
  );
};

// --- COMPONENT: Tracker Page (Same as before) ---
const TrackerPage = ({ day, history, onSave, onBack }) => {
  const todayData = history[day] || { dsa: '', dev: '', core: '', completed: false };
  const [inputs, setInputs] = useState(todayData);

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="animate-fade-in-up w-full">
      <header className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-4">
        <button 
          onClick={onBack}
          className="text-neutral-500 hover:text-white transition-colors text-sm"
        >
          ← EXIT
        </button>
        <h2 className="text-2xl font-bold tracking-tight">LOG DAY <span className="text-red-600">{day}</span></h2>
      </header>

      <div className="space-y-6">
        <div className="bg-neutral-900 rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-blue-400 font-bold mb-2 uppercase text-sm tracking-wider">01. DSA / LeetCode</h3>
          <textarea 
            className="w-full bg-black border border-neutral-800 rounded p-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
            value={inputs.dsa}
            onChange={(e) => handleChange('dsa', e.target.value)}
          />
        </div>

        <div className="bg-neutral-900 rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-green-400 font-bold mb-2 uppercase text-sm tracking-wider">02. MERN Development</h3>
          <textarea 
            className="w-full bg-black border border-neutral-800 rounded p-3 text-sm text-gray-300 focus:outline-none focus:border-green-500 transition-colors h-24 resize-none"
            value={inputs.dev}
            onChange={(e) => handleChange('dev', e.target.value)}
          />
        </div>

        <div className="bg-neutral-900 rounded-lg p-6 border-l-4 border-red-500">
          <h3 className="text-red-400 font-bold mb-2 uppercase text-sm tracking-wider">03. Core CS Subjects</h3>
          <textarea 
            className="w-full bg-black border border-neutral-800 rounded p-3 text-sm text-gray-300 focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
            value={inputs.core}
            onChange={(e) => handleChange('core', e.target.value)}
          />
        </div>
      </div>

      <button 
        onClick={() => onSave(day, { ...inputs, completed: true })}
        className="w-full mt-8 bg-green-600 hover:bg-green-500 text-black font-bold py-4 rounded uppercase tracking-widest transition-colors shadow-lg shadow-green-900/20"
      >
        Mark Day {day} Complete
      </button>

      <div className="mt-12 pt-8 border-t border-neutral-800">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 60 }, (_, i) => i + 1).map((d) => {
             const isDone = history[d]?.completed;
             const isCurrent = d === day;
             let bgClass = 'bg-neutral-800 text-neutral-600'; 
             if (isDone) bgClass = 'bg-green-600 text-black font-bold';
             if (isCurrent) bgClass = 'bg-white text-black font-bold animate-pulse';
             return (
              <div key={d} className={`w-8 h-8 flex items-center justify-center text-xs rounded ${bgClass}`}>
                {d}
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;