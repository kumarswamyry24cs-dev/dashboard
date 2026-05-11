import React, { useState, useEffect } from 'react';

const Level1StationDecoder = ({ onComplete }) => {
  const [stations, setStations] = useState([
    { id: 1, name: 'Central Hub', signal: 87, frequency: '2.4GHz', decoded: false },
    { id: 2, name: 'North Station', signal: 72, frequency: '2.4GHz', decoded: false },
    { id: 3, name: 'East Terminal', signal: 65, frequency: '5.0GHz', decoded: false },
    { id: 4, name: 'West Complex', signal: 91, frequency: '2.4GHz', decoded: false },
    { id: 5, name: 'South Port', signal: 58, frequency: '5.0GHz', decoded: false },
  ]);

  const [decodingActive, setDecodingActive] = useState(false);

  // Auto-decode stations one by one
  useEffect(() => {
    if (!decodingActive) return;

    const undecodedIndex = stations.findIndex(s => !s.decoded);
    if (undecodedIndex === -1) {
      // All decoded
      setDecodingActive(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setStations(prev =>
        prev.map((s, idx) => idx === undecodedIndex ? { ...s, decoded: true } : s)
      );
    }, 800);

    return () => clearTimeout(timer);
  }, [decodingActive, stations, onComplete]);

  const handleDecodeClick = () => {
    setDecodingActive(true);
  };

  const decodedCount = stations.filter(s => s.decoded).length;
  const allDecoded = decodedCount === stations.length;

  const handleStationClick = (id) => {
    setStations(prev =>
      prev.map(s => s.id === id ? { ...s, decoded: !s.decoded } : s)
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Section */}
      <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-card border border-cyber-cyan rounded-lg">
        <h2 className="text-3xl font-orbitron font-bold glow-text mb-2">LEVEL 1: STATION SIGNAL DECODER</h2>
        <p className="text-cyber-text">Decode all station signals to unlock the next phase. Click stations to toggle decode status, or activate the auto-decoder sequence.</p>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-cyber-card border border-cyber-green rounded-lg">
        <p className="text-sm font-tech-mono text-cyber-green mb-2">📡 DECODING SEQUENCE</p>
        <p className="text-xs text-cyber-text">
          {decodingActive ? 'Auto-decoding stations...' : allDecoded ? '✓ All stations decoded!' : `${decodedCount}/${stations.length} stations decoded. Click the button below to start auto-decode or click individual stations.`}
        </p>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map(station => (
          <div
            key={station.id}
            onClick={() => !decodingActive && handleStationClick(station.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
              station.decoded
                ? 'border-cyber-green bg-cyber-card shadow-glow-green'
                : 'border-cyber-cyan bg-cyber-card hover:shadow-glow-cyan'
            } ${decodingActive ? 'opacity-75' : ''}`}
          >
            {/* Station Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-orbitron text-sm glow-text">{station.name}</h3>
              <span className={`text-xl ${station.decoded ? 'text-cyber-green' : 'text-cyber-cyan'}`}>
                {station.decoded ? '✓' : '◐'}
              </span>
            </div>

            {/* Signal Meter */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400 font-tech-mono">Signal</span>
                <span className="text-sm font-tech-mono text-cyber-cyan font-bold">{station.signal}%</span>
              </div>
              <div className="w-full h-2 bg-cyber-dark border border-cyber-cyan rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all"
                  style={{ width: `${station.signal}%` }}
                />
              </div>
            </div>

            {/* Frequency */}
            <div className="text-xs font-tech-mono text-gray-400">
              <span className="block mb-2">Frequency: <span className="text-cyber-green">{station.frequency}</span></span>
              <span className="block">Status: <span className={station.decoded ? 'text-cyber-green' : 'text-cyber-orange'}>
                {station.decoded ? 'DECODED' : 'DECODING'}
              </span></span>
            </div>
          </div>
        ))}
      </div>

      {/* Auto-Decode Button */}
      <div className="flex justify-center">
        <button
          onClick={handleDecodeClick}
          disabled={decodingActive || allDecoded}
          className={`px-6 py-3 font-orbitron font-bold text-sm rounded border-2 transition-all ${
            decodingActive || allDecoded
              ? 'border-cyber-cyan text-cyber-cyan opacity-50 cursor-not-allowed'
              : 'border-cyber-green text-cyber-green hover:shadow-glow-green active:scale-95'
          }`}
        >
          {allDecoded ? '✓ LEVEL COMPLETE' : decodingActive ? '⟳ DECODING...' : 'START AUTO-DECODE'}
        </button>
      </div>

      {/* Progress Summary */}
      <div className="p-4 bg-cyber-card border border-cyber-green rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-tech-mono text-cyber-green font-bold">{decodedCount}</div>
            <div className="text-xs text-gray-400 font-tech-mono">Decoded</div>
          </div>
          <div>
            <div className="text-2xl font-tech-mono text-cyber-cyan font-bold">{stations.length}</div>
            <div className="text-xs text-gray-400 font-tech-mono">Total</div>
          </div>
          <div>
            <div className="text-2xl font-tech-mono text-cyber-orange font-bold">{Math.round((decodedCount / stations.length) * 100)}%</div>
            <div className="text-xs text-gray-400 font-tech-mono">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level1StationDecoder;
