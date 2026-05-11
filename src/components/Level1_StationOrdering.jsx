import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';

const Level1StationOrdering = ({ onComplete }) => {
  // Station data: ID and its signal value (calculated from ASCII values)
  const corruptedStations = ['QA', 'FM', 'BT', 'HX', 'DP', 'AK', 'RC', 'LM', 'ZF', 'KN', 'PE', 'CU', 'SJ', 'VG'];
  
  const [decodedData, setDecodedData] = useState([]);
  const [decodingComplete, setDecodingComplete] = useState(false);
  const [sortedStations, setSortedStations] = useState([]);
  const [disorderAnalysis, setDisorderAnalysis] = useState(null);
  const [decodeProgress, setDecodeProgress] = useState(0);

  // Calculate signal value from station ID (sum of ASCII values / 10, rounded)
  const calculateSignalValue = (stationId) => {
    const ascii1 = stationId.charCodeAt(0);
    const ascii2 = stationId.charCodeAt(1);
    return Math.round((ascii1 + ascii2) / 10);
  };

  // Merge sort to count inversions
  const countInversions = (arr) => {
    let inversions = 0;

    const merge = (left, right) => {
      let result = [];
      let i = 0, j = 0;

      while (i < left.length && j < right.length) {
        if (left[i].signal <= right[j].signal) {
          result.push(left[i]);
          i++;
        } else {
          inversions += left.length - i;
          result.push(right[j]);
          j++;
        }
      }

      return result.concat(left.slice(i)).concat(right.slice(j));
    };

    const mergeSortHelper = (arr) => {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = mergeSortHelper(arr.slice(0, mid));
      const right = mergeSortHelper(arr.slice(mid));

      return merge(left, right);
    };

    mergeSortHelper(arr);
    return inversions;
  };

  // Decode stations sequentially
  useEffect(() => {
    let currentIndex = 0;

    const decodeInterval = setInterval(() => {
      if (currentIndex < corruptedStations.length) {
        const station = corruptedStations[currentIndex];
        const ascii1 = station.charCodeAt(0);
        const ascii2 = station.charCodeAt(1);
        const signal = calculateSignalValue(station);

        setDecodedData(prev => [...prev, {
          station,
          letter1: station[0],
          ascii1,
          letter2: station[1],
          ascii2,
          signal
        }]);

        setDecodeProgress(((currentIndex + 1) / corruptedStations.length) * 100);
        currentIndex++;
      } else {
        setDecodingComplete(true);
        clearInterval(decodeInterval);
      }
    }, 100);

    return () => clearInterval(decodeInterval);
  }, []);

  // Sort and analyze disorder when decoding completes
  useEffect(() => {
    if (decodingComplete && decodedData.length === corruptedStations.length) {
      const sorted = [...decodedData].sort((a, b) => a.signal - b.signal);
      setSortedStations(sorted);

      const inversions = countInversions(decodedData);
      const maxInversions = (corruptedStations.length * (corruptedStations.length - 1)) / 2;
      const disorderPercentage = (inversions / maxInversions) * 100;

      let disorderLevel = 'LOW';
      if (disorderPercentage > 60) disorderLevel = 'CRITICAL';
      else if (disorderPercentage > 30) disorderLevel = 'MODERATE';

      setDisorderAnalysis({
        inversions,
        maxInversions,
        percentage: disorderPercentage,
        level: disorderLevel
      });

      // Complete the level and pass sorted stations
      setTimeout(() => {
        const stationNames = sorted.map(station => station.station);
        const signalValues = {};
        sorted.forEach(station => {
          signalValues[station.station] = station.signal;
        });
        
        // Save to global store and call onComplete
        if (onComplete) {
          onComplete({
            sortedStations: stationNames,
            signalValues,
            inversionCount: inversions,
            disorderLevel
          });
        }
      }, 1000);
    }
  }, [decodingComplete, decodedData, onComplete, corruptedStations.length]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="p-4 bg-gradient-to-r from-cyber-dark to-cyber-card border border-cyber-cyan rounded-lg">
        <h2 className="text-2xl font-orbitron font-bold glow-text mb-2">LEVEL 1: STATION ORDERING & DISORDER ANALYSIS</h2>
        <p className="text-sm text-cyber-text">Decode corrupted station registry and analyze disorder metrics</p>
      </div>

      {/* Three Panel Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Panel 1: Corrupted Registry Input */}
        <CorruptedRegistryPanel stations={corruptedStations} />

        {/* Panel 2: Signal Decoder */}
        <SignalDecoderPanel decodedData={decodedData} progress={decodeProgress} isComplete={decodingComplete} />

        {/* Panel 3: Sorted Registry */}
        <SortedRegistryPanel stations={sortedStations} isVisible={decodingComplete} />
      </div>

      {/* Disorder Analysis Section */}
      {disorderAnalysis && (
        <DisorderAnalysisPanel analysis={disorderAnalysis} />
      )}
    </div>
  );
};

// Panel 1: Corrupted Registry Input
const CorruptedRegistryPanel = ({ stations }) => {
  return (
    <div className="p-4 bg-cyber-card border-2 border-red-500 rounded-lg h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <h3 className="font-orbitron text-sm font-bold text-red-500">CORRUPTED REGISTRY INPUT</h3>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {stations.map((station, idx) => (
            <div
              key={station}
              className="p-2 bg-red-900 bg-opacity-30 border border-red-500 rounded text-center font-orbitron text-xs font-bold text-red-400 animate-glitch"
              style={{
                animationDelay: `${idx * 50}ms`,
                textShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
              }}
            >
              {station}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-red-500 text-xs text-red-400 font-tech-mono text-center">
        {stations.length} STATIONS CORRUPTED
      </div>
    </div>
  );
};

// Panel 2: Signal Decoder
const SignalDecoderPanel = ({ decodedData, progress, isComplete }) => {
  return (
    <div className="p-4 bg-cyber-card border-2 border-cyber-cyan rounded-lg h-full flex flex-col">
      <h3 className="font-orbitron text-sm font-bold text-cyber-cyan mb-3 glow-text">SIGNAL DECODER</h3>

      {/* Table */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="text-xs font-tech-mono space-y-1">
          {/* Header */}
          <div className="grid grid-cols-6 gap-1 pb-2 border-b border-cyber-cyan text-cyber-cyan font-bold sticky top-0 bg-cyber-card">
            <div>STA</div>
            <div>L₁</div>
            <div>A₁</div>
            <div>L₂</div>
            <div>A₂</div>
            <div className="text-center">SIGNAL</div>
          </div>

          {/* Rows */}
          {decodedData.map((row, idx) => (
            <div
              key={row.station}
              className="grid grid-cols-6 gap-1 p-1 bg-cyber-dark bg-opacity-50 rounded animate-slide-in-up"
              style={{
                animationDelay: `${idx * 100}ms`
              }}
            >
              <div className="text-gray-300">{row.station}</div>
              <div className="text-gray-300">{row.letter1}</div>
              <div className="text-gray-400">{row.ascii1}</div>
              <div className="text-gray-300">{row.letter2}</div>
              <div className="text-gray-400">{row.ascii2}</div>
              <div className="text-center text-cyber-cyan font-bold">{row.signal}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-tech-mono text-gray-400">
          <span>{isComplete ? 'DECODE COMPLETE' : 'DECODING...'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-cyber-dark border border-cyber-cyan rounded overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {isComplete && (
          <div className="text-xs font-orbitron text-cyber-green text-center mt-2">✓ DECODE COMPLETE</div>
        )}
      </div>
    </div>
  );
};

// Panel 3: Sorted Registry
const SortedRegistryPanel = ({ stations, isVisible }) => {
  return (
    <div className="p-4 bg-cyber-card border-2 border-cyber-green rounded-lg h-full flex flex-col">
      {isVisible && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-cyber-green rounded-full"></div>
          <h3 className="font-orbitron text-sm font-bold text-cyber-green glow-text-green">SORTED REGISTRY (RESTORED)</h3>
        </div>
      )}

      <div className="space-y-2 flex-1 overflow-y-auto">
        {stations.map((station, idx) => (
          <div
            key={`${station.station}-${idx}`}
            className="p-2 bg-cyber-green bg-opacity-20 border border-cyber-green rounded font-orbitron text-xs font-bold text-cyber-green animate-bounce-in"
            style={{
              animationDelay: `${idx * 80}ms`,
              textShadow: '0 0 10px rgba(57, 255, 20, 0.6)'
            }}
          >
            <div className="flex items-center justify-between">
              <span>{String(idx + 1).padStart(2, '0')}.</span>
              <span>{station.station}</span>
              <span className="text-cyber-cyan">{station.signal}</span>
            </div>
          </div>
        ))}
      </div>

      {isVisible && (
        <div className="mt-4 pt-4 border-t border-cyber-green text-xs text-cyber-green font-orbitron text-center">
          ✓ REGISTRY RESTORED
        </div>
      )}
    </div>
  );
};

// Disorder Analysis Panel
const DisorderAnalysisPanel = ({ analysis }) => {
  return (
    <div className="p-6 bg-cyber-card border-2 border-cyber-orange rounded-lg space-y-4">
      <h3 className="font-orbitron text-lg font-bold glow-text-orange">INVERSION COUNT: Registry Disorder Level</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Inversion Count Display */}
        <div className="flex flex-col items-center justify-center p-4 bg-cyber-dark bg-opacity-50 rounded border border-red-500">
          <div className="text-xs text-gray-400 font-tech-mono mb-2">TOTAL INVERSIONS</div>
          <div className="text-5xl font-tech-mono font-bold text-red-500 glow-text-orange animate-pulse">
            {analysis.inversions}
          </div>
          <div className="text-xs text-gray-500 mt-2 font-tech-mono">
            of {analysis.maxInversions} possible
          </div>
        </div>

        {/* Center: Disorder Meter (Gauge) */}
        <DisorderMeter value={analysis.percentage} level={analysis.level} />

        {/* Right: Status and Details */}
        <div className="space-y-2">
          <div className="p-3 bg-cyber-dark bg-opacity-50 rounded border border-cyber-cyan">
            <p className="text-xs text-gray-400 font-tech-mono mb-1">DISORDER LEVEL</p>
            <p className={`text-xl font-orbitron font-bold ${
              analysis.level === 'CRITICAL' ? 'text-red-500' :
              analysis.level === 'MODERATE' ? 'text-cyber-orange' :
              'text-cyber-green'
            }`}>
              {analysis.level}
            </p>
          </div>
          <div className="p-3 bg-cyber-dark bg-opacity-50 rounded border border-cyber-cyan">
            <p className="text-xs text-gray-400 font-tech-mono mb-1">DISORDER %</p>
            <p className="text-xl font-tech-mono font-bold text-cyber-cyan">
              {Math.round(analysis.percentage)}%
            </p>
          </div>
          <div className="p-3 bg-cyber-dark bg-opacity-50 rounded border border-cyber-cyan">
            <p className="text-xs text-gray-400 font-tech-mono mb-1">STATUS</p>
            <p className="text-sm font-orbitron text-cyber-green">✓ ANALYSIS COMPLETE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Disorder Meter (Semicircular Gauge)
const DisorderMeter = ({ value, level }) => {
  const rotation = (value / 100) * 180 - 90; // Convert to rotation angle

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-cyber-dark bg-opacity-50 rounded border border-cyber-orange">
      <div className="relative w-40 h-20">
        {/* Background semicircle */}
        <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* Gauge track */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="#1a3a3a"
            strokeWidth="8"
          />
          {/* Colored sections */}
          <path d="M 20 80 A 60 60 0 0 1 73.3 23.4" fill="none" stroke="#39ff14" strokeWidth="8" />
          <path d="M 73.3 23.4 A 60 60 0 0 1 126.6 23.4" fill="none" stroke="#ff6b35" strokeWidth="8" />
          <path d="M 126.6 23.4 A 60 60 0 0 1 180 80" fill="none" stroke="#ff3333" strokeWidth="8" />
          
          {/* Center point */}
          <circle cx="100" cy="80" r="4" fill="#00f5ff" />
          
          {/* Needle */}
          <line
            x1="100"
            y1="80"
            x2={100 + 50 * Math.cos((rotation * Math.PI) / 180)}
            y2={80 + 50 * Math.sin((rotation * Math.PI) / 180)}
            stroke="#00f5ff"
            strokeWidth="2"
            style={{ transition: 'all 0.5s ease-out' }}
          />
        </svg>
      </div>

      <div className="mt-4 text-center">
        <p className="text-2xl font-tech-mono font-bold text-cyber-cyan">
          {Math.round(value)}%
        </p>
        <p className="text-xs text-gray-400 font-tech-mono mt-1">DISORDER</p>
      </div>
    </div>
  );
};

export default Level1StationOrdering;
