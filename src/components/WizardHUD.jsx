import React, { useState, useEffect } from 'react';

const WizardHUD = ({ currentLevel, totalLevels }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const progressPercentage = (currentLevel / totalLevels) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b-2 border-cyber-cyan bg-gradient-to-r from-cyber-dark to-cyber-card backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-cyber-cyan rounded flex items-center justify-center">
              <div className="w-6 h-6 border border-cyber-green rounded-full animate-spin"></div>
            </div>
            <h1 className="text-lg font-orbitron font-bold glow-text animate-text-glitch">SMART CITY RECOVERY</h1>
            <span className="text-xs text-cyber-cyan tracking-widest">v1.0</span>
          </div>

          {/* Center: Progress */}
          <div className="flex-1 mx-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-tech-mono text-cyber-cyan">PROGRESS</span>
              <span className="text-xs font-tech-mono text-cyber-green">{currentLevel}/{totalLevels}</span>
            </div>
            <div className="w-full h-3 bg-cyber-card border border-cyber-cyan rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green shadow-glow-cyan transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Right: Clock */}
          <div className="text-right ml-8">
            <div className="text-xl font-tech-mono glow-text-green">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-xs text-cyber-green tracking-widest">LIVE</div>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-cyber-cyan via-cyber-green to-transparent rounded-full opacity-60"></div>
      </div>
    </div>
  );
};

export default WizardHUD;
