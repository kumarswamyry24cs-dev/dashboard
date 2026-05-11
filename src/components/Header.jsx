import React, { useState, useEffect } from 'react';

const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b-2 border-cyber-cyan bg-gradient-to-r from-cyber-dark to-cyber-card">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-cyber-cyan rounded flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 border-2 border-cyber-green rounded-full animate-spin"></div>
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold glow-text">SMART CITY EMERGENCY</h1>
              <p className="text-xs text-cyber-cyan tracking-widest">RECOVERY SYSTEM v4.2.1</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-tech-mono glow-text-green">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-xs text-cyber-green tracking-widest">
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-cyber-cyan via-cyber-green to-cyber-orange rounded-full opacity-60"></div>
      </div>
    </header>
  );
};

export default Header;
