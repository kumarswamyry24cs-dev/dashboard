import React, { useState, useEffect } from 'react';
import WizardHUD from './WizardHUD';
import Level1StationOrdering from './Level1_StationOrdering';
import Level2StationDependencyMatrix from './Level2_DependencyMatrix';
import Level3MissionReport from './Level3_MissionReport';
import NextButton from './NextButton';
import useSoundEffects from '../hooks/useSoundEffects';
import useAppStore from '../store/appStore';

const Wizard = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showScanline, setShowScanline] = useState(false);
  const [showGreenFlash, setShowGreenFlash] = useState(false);
  const [showWipeAnimation, setShowWipeAnimation] = useState(false);
  
  // Global state from Zustand
  const currentLevel = useAppStore((state) => state.currentLevel);
  const setCurrentLevel = useAppStore((state) => state.setCurrentLevel);
  const level1Complete = useAppStore((state) => state.level1Complete);
  const level2Complete = useAppStore((state) => state.level2Complete);
  const level3Complete = useAppStore((state) => state.level3Complete);
  const setLevel1Data = useAppStore((state) => state.setLevel1Data);
  const setLevel2Data = useAppStore((state) => state.setLevel2Data);
  const setLevel3Data = useAppStore((state) => state.setLevel3Data);
  
  const { soundEnabled, playBeep, playSuccess, toggleSound } = useSoundEffects();

  const totalLevels = 3;
  
  // Map global completion flags to local state for compatibility
  const levelComplete = {
    1: level1Complete,
    2: level2Complete,
    3: level3Complete,
  };

  const handleLevelComplete = (level, data = null) => {
    playSuccess();
    
    // Store data to global state
    if (level === 1 && data) {
      setLevel1Data(data);
    } else if (level === 2 && data) {
      setLevel2Data(data);
    } else if (level === 3 && data) {
      setLevel3Data(data);
    }
  };

  const handleNext = () => {
    if (currentLevel < totalLevels && levelComplete[currentLevel]) {
      playBeep();
      
      // Special transition for Level 1 -> 2
      if (currentLevel === 1) {
        setShowGreenFlash(true);
        setTimeout(() => {
          setShowGreenFlash(false);
          setShowWipeAnimation(true);
          setIsTransitioning(true);
          
          setTimeout(() => {
            setCurrentLevel(2);
            setIsTransitioning(false);
            setShowWipeAnimation(false);
          }, 800);
        }, 600);
      } else {
        // Standard transition for other levels
        setShowScanline(true);
        setIsTransitioning(true);
        
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          setIsTransitioning(false);
          setShowScanline(false);
        }, 800);
      }
    }
  };

  // Keyboard shortcut - Enter key to advance
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && levelComplete[currentLevel] && currentLevel < totalLevels) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentLevel, levelComplete]);

  const handleMissionComplete = () => {
    playSuccess();
    console.log('Mission Complete!');
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text flex flex-col">
      {/* Fixed HUD Header */}
      <WizardHUD currentLevel={currentLevel} totalLevels={totalLevels} />

      {/* Green Flash Overlay - Level 1 to 2 Transition */}
      {showGreenFlash && (
        <div className="fixed inset-0 bg-cyber-green animate-flash-green pointer-events-none z-50 flex items-center justify-center">
          <div className="text-5xl font-orbitron font-bold text-cyber-green glow-text-green animate-pulse">
            REGISTRY RESTORED
          </div>
        </div>
      )}

      {/* Wipe Animation Overlay */}
      {showWipeAnimation && (
        <div className="fixed inset-0 bg-gradient-to-r from-cyber-green via-cyber-cyan to-cyber-dark animate-wipe-right pointer-events-none z-40" />
      )}

      {/* Scanline Sweep Animation */}
      {showScanline && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-b from-cyber-green to-transparent animate-scanline-sweep pointer-events-none z-40" />
      )}

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="fixed top-32 right-6 z-30 px-3 py-2 text-xs font-tech-mono bg-cyber-dark border border-cyber-cyan rounded hover:bg-cyber-cyan hover:bg-opacity-10 transition-all"
        title="Toggle sound effects"
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      {/* Main Content */}
      <main className="flex-1 mt-24 pb-32 px-3 sm:px-6 max-w-7xl mx-auto w-full">
        <div
          className={`transition-all duration-300 ${
            isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
          }`}
        >
          {currentLevel === 1 && (
            <Level1StationOrdering onComplete={(data) => handleLevelComplete(1, data)} />
          )}

          {currentLevel === 2 && (
            <Level2StationDependencyMatrix 
              onComplete={(data) => handleLevelComplete(2, data)} 
            />
          )}

          {currentLevel === 3 && (
            <Level3MissionReport 
              onComplete={(data) => {
                handleLevelComplete(3, data);
                handleMissionComplete();
              }} 
            />
          )}
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-cyber-dark via-cyber-dark to-transparent pt-8 pb-6 border-t border-cyber-cyan">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* Left: Level Info */}
          <div className="text-xs font-tech-mono text-gray-400 text-center sm:text-left">
            <p>LEVEL {currentLevel} OF {totalLevels}</p>
            {currentLevel === 1 && <p className="text-cyber-cyan hidden sm:block">Station Ordering & Disorder Analysis</p>}
            {currentLevel === 2 && <p className="text-cyber-cyan hidden sm:block">Station Dependency Matrix</p>}
            {currentLevel === 3 && <p className="text-cyber-cyan hidden sm:block">Recovery Mission — Final Report</p>}
          </div>

          {/* Center: Status */}
          <div className="text-xs font-tech-mono text-center order-3 sm:order-2 w-full sm:w-auto">
            {levelComplete[currentLevel] ? (
              <span className="text-cyber-green animate-pulse">✓ Level Complete - Ready to proceed</span>
            ) : (
              <span className="text-cyber-orange">⟳ Complete the current level to continue</span>
            )}
          </div>

          {/* Right: Next Button */}
          <div className="order-2 sm:order-3">
            <NextButton
              isComplete={levelComplete[currentLevel]}
              onClick={handleNext}
              disabled={currentLevel === totalLevels && levelComplete[currentLevel]}
            />
          </div>
        </div>
      </footer>

      {/* Mission Complete Overlay */}
      {currentLevel === totalLevels && levelComplete[3] && (
        <div className="fixed inset-0 bg-cyber-dark bg-opacity-90 flex items-center justify-center z-50 animate-fade-in pointer-events-none">
          <div className="text-center animate-pulse">
            <h1 className="text-5xl font-orbitron font-bold glow-text-green mb-4">MISSION COMPLETE</h1>
            <p className="text-cyber-text text-lg">All levels successfully completed!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wizard;
