import React, { useEffect, useState } from 'react';

const BootSequence = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const bootLogs = [
    '> SMART CITY RECOVERY SYSTEM v1.0',
    '> Initializing recovery protocol...',
    '> Loading station registry...',
    '> Decoding transmission signals...',
    '> Corruption detected in 14 stations',
    '> Manual override required',
    '> [WARNING] Dependency cycles may exist',
    '> Waiting for user intervention...',
    '',
    '>> READY FOR MISSION START'
  ];

  useEffect(() => {
    let currentIndex = 0;

    const logInterval = setInterval(() => {
      if (currentIndex < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(logInterval);
        
        // Fade out after 2.5 seconds
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 1500);
      }
    }, 200);

    return () => clearInterval(logInterval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-cyber-dark z-50 flex items-center justify-center transition-opacity duration-500 ${
      isComplete ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none animate-scan-lines opacity-10" />

      {/* Terminal container */}
      <div className="w-full max-w-2xl mx-auto px-6 font-tech-mono text-sm">
        {/* CRT screen effect */}
        <div className="border-2 border-cyber-cyan rounded p-6 bg-black bg-opacity-80 shadow-glow-cyan">
          {/* Terminal logs */}
          <div className="space-y-1 min-h-64">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="text-cyber-green animate-fade-in"
                style={{
                  animationDelay: `${idx * 50}ms`
                }}
              >
                {log}
              </div>
            ))}
            
            {/* Blinking cursor */}
            {!isComplete && (
              <div className="text-cyber-green animate-pulse">▌</div>
            )}
          </div>

          {/* Bottom info */}
          <div className="mt-4 pt-4 border-t border-cyber-green border-opacity-30 text-xs text-cyber-green opacity-50">
            Press any key or wait to continue...
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-cyber-cyan opacity-0 pointer-events-none" style={{
        animation: 'pulse-glow 3s ease-in-out 1'
      }} />
    </div>
  );
};

export default BootSequence;
