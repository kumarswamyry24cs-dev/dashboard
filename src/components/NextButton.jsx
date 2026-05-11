import React from 'react';

const NextButton = ({ isComplete, onClick, disabled }) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={disabled || !isComplete}
        className={`px-8 py-3 font-orbitron font-bold text-sm tracking-widest rounded border-2 transition-all duration-300 ${
          isComplete
            ? 'border-cyber-green text-cyber-green hover:shadow-glow-green active:scale-95 animate-pulse-glow'
            : 'border-gray-600 text-gray-500 opacity-50 cursor-not-allowed'
        }`}
        title={!isComplete ? 'Complete this level first' : 'Proceed to next level'}
      >
        NEXT →
      </button>
      {!isComplete && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-tech-mono text-gray-400 bg-cyber-card border border-gray-600 px-3 py-1 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Complete this level first
        </div>
      )}
    </div>
  );
};

export default NextButton;
