import React, { useState, useEffect } from 'react';

const Level3Transition = ({ onTransitionComplete }) => {
  const [phase, setPhase] = useState('critical'); // 'critical' -> 'drones' -> 'complete'
  const [droneCount, setDroneCount] = useState(0);

  useEffect(() => {
    // Phase 1: Critical failure screen (1.5 seconds)
    const criticalTimer = setTimeout(() => {
      setPhase('drones');
    }, 1500);

    return () => clearTimeout(criticalTimer);
  }, []);

  // Drone deployment phase
  useEffect(() => {
    if (phase === 'drones') {
      let droneDeployed = 0;
      const droneInterval = setInterval(() => {
        if (droneDeployed < 8) {
          setDroneCount(prev => prev + 1);
          droneDeployed++;
        } else {
          clearInterval(droneInterval);
          // Transition to complete after drones finish
          setTimeout(() => {
            setPhase('complete');
            onTransitionComplete();
          }, 800);
        }
      }, 150);

      return () => clearInterval(droneInterval);
    }
  }, [phase, onTransitionComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-cyber-dark flex flex-col items-center justify-center overflow-hidden">
      {/* Phase 1: Critical Failure Screen */}
      {phase === 'critical' && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-pulse-intense">
          {/* Screen shake effect */}
          <div className="animate-screen-shake w-full h-full flex flex-col items-center justify-center">
            {/* Red warning border */}
            <div className="absolute inset-0 border-8 border-red-600 opacity-60 animate-pulse" />

            {/* Critical warning text */}
            <div className="space-y-6 text-center">
              <div className="text-5xl font-orbitron font-black text-red-600 animate-flicker">
                ⚠️ CRITICAL INFRASTRUCTURE FAILURE
              </div>
              <div className="text-3xl font-orbitron text-red-500 animate-flicker" style={{ animationDelay: '100ms' }}>
                COMMUNICATION BACKBONE COLLAPSED
              </div>

              {/* System status indicators */}
              <div className="mt-12 space-y-3 font-tech-mono text-sm">
                <div className="text-red-600 animate-pulse">
                  ▌ CORE NETWORK: OFFLINE
                </div>
                <div className="text-red-600 animate-pulse" style={{ animationDelay: '200ms' }}>
                  ▌ ROUTING PROTOCOL: FAILED
                </div>
                <div className="text-red-600 animate-pulse" style={{ animationDelay: '400ms' }}>
                  ▌ BACKUP SYSTEMS: ENGAGED
                </div>
              </div>
            </div>

            {/* Scanlines effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 bg-red-600 opacity-20"
                  style={{
                    marginTop: `${i * 5}%`,
                    animation: 'scanline-flicker 0.15s infinite',
                    animationDelay: `${i * 50}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Drone Deployment */}
      {phase === 'drones' && (
        <div className="w-full h-full flex flex-col items-center justify-between py-20 bg-gradient-to-b from-red-900/20 via-cyber-dark to-cyber-dark">
          {/* Deploying message */}
          <div className="text-center">
            <div className="text-3xl font-orbitron font-bold text-cyber-green animate-pulse mb-4">
              🤖 DEPLOYING REPAIR DRONES...
            </div>
            <div className="text-sm font-tech-mono text-cyber-cyan">
              AUTONOMOUS NETWORK RECONSTRUCTION PROTOCOL
            </div>
          </div>

          {/* Drone flight area */}
          <div className="relative w-full h-40 bg-gradient-to-b from-transparent to-cyber-green/10 border-y-2 border-cyber-green overflow-hidden">
            {/* Grid background */}
            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" stroke="currentColor" />
            </svg>

            {/* Flying drones */}
            {[...Array(droneCount)].map((_, i) => (
              <div
                key={i}
                className="absolute h-8 text-cyber-green font-bold text-2xl animate-drone-fly"
                style={{
                  top: `${20 + (i % 4) * 25}%`,
                  animation: `drone-fly 2s ease-in-out forwards`,
                  animationDelay: `${i * 150}ms`,
                }}
              >
                🤖
              </div>
            ))}

            {/* Drone trails */}
            {[...Array(droneCount)].map((_, i) => (
              <div
                key={`trail-${i}`}
                className="absolute h-0.5 bg-gradient-to-r from-cyber-green to-transparent"
                style={{
                  top: `${20 + (i % 4) * 25}%`,
                  width: '100%',
                  opacity: 0.5,
                  animation: `drone-fly 2s ease-in-out forwards`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>

          {/* Status message */}
          <div className="text-center">
            <div className="text-lg font-tech-mono text-cyber-cyan mb-4">
              {droneCount}/8 DRONES DEPLOYED
            </div>
            <div className="w-64 h-2 bg-cyber-card border border-cyber-cyan rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all duration-300"
                style={{ width: `${(droneCount / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Phase 3: Fade out */}
      {phase === 'complete' && (
        <div className="absolute inset-0 bg-cyber-dark animate-fade-out" />
      )}
    </div>
  );
};

export default Level3Transition;
