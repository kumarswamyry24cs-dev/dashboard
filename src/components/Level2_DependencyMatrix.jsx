import React, { useState } from 'react';
import NetworkDependencyGraph from './NetworkDependencyGraph';
import useAppStore from '../store/appStore';

const Level2StationDependencyMatrix = ({ onComplete }) => {
  // Read sorted stations from global store
  const sortedStations = useAppStore((state) => state.sortedStations);
  
  // Station order for the matrix
  const stationOrder = ['AK', 'QA', 'FM', 'DP', 'RC', 'PE', 'BT', 'CU', 'LM', 'KN', 'SJ', 'VG', 'HX', 'ZF'];
  
  // Signal values for each station
  const stationSignals = {
    'AK': 14, 'QA': 15, 'FM': 15, 'DP': 15, 'RC': 15, 'PE': 15,
    'BT': 15, 'CU': 15, 'LM': 15, 'KN': 15, 'SJ': 16, 'VG': 16, 'HX': 16, 'ZF': 16
  };

  // Hardcoded 14x14 dependency matrix
  const dependencyMatrix = [
    [0,0,0,0,1,0,1,0,0,0,0,0,0,0], // AK
    [0,0,0,0,0,1,0,1,0,0,0,0,0,0], // QA
    [0,0,0,0,0,1,0,0,1,0,0,0,0,0], // FM
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0], // DP
    [0,1,0,0,0,0,1,0,0,0,0,0,0,0], // RC
    [0,0,0,0,0,0,0,1,1,0,0,0,0,0], // PE
    [0,0,1,0,0,0,0,0,0,1,0,0,0,0], // BT
    [0,0,0,0,0,0,0,0,1,0,1,0,0,0], // CU
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0], // LM
    [0,0,0,0,0,0,0,0,0,0,1,0,1,0], // KN
    [0,0,0,0,0,0,0,0,0,0,0,1,0,1], // SJ
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0], // VG
    [0,0,0,0,0,0,0,0,0,0,0,0,0,1], // HX
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0], // ZF
  ];

  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Activation Sequencer states
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [inDegrees, setInDegrees] = useState([]);
  const [queue, setQueue] = useState([]);
  const [activationSequence, setActivationSequence] = useState([]);
  const [cycleDetected, setCycleDetected] = useState(false);
  const [cycleStations, setCycleStations] = useState([]);
  const [sequencerComplete, setSequencerComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCellHover = (rowIdx, colIdx, e) => {
    if (rowIdx === colIdx) return; // Skip diagonal
    
    const hasDependency = dependencyMatrix[rowIdx][colIdx] === 1;
    if (hasDependency) {
      setTooltip({
        row: stationOrder[rowIdx],
        col: stationOrder[colIdx]
      });
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
    
    setHoveredRow(rowIdx);
    setHoveredCol(colIdx);
  };

  const handleCellLeave = () => {
    setHoveredRow(null);
    setHoveredCol(null);
    setTooltip(null);
  };

  const handleZoom = (direction) => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(newZoom, 2));
    });
  };

  // Kahn's Algorithm - Calculate in-degrees
  const calculateInDegrees = () => {
    const inDeg = Array(14).fill(0);
    for (let i = 0; i < 14; i++) {
      for (let j = 0; j < 14; j++) {
        if (dependencyMatrix[i][j] === 1) {
          inDeg[j]++; // j depends on i, so j has incoming edge
        }
      }
    }
    return inDeg;
  };

  // Run Kahn's Algorithm with animation
  const runActivationSequencer = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setActivationSequence([]);
    setCycleDetected(false);
    setCycleStations([]);
    setSequencerComplete(false);

    const inDeg = calculateInDegrees();
    setInDegrees([...inDeg]);

    // Initialize queue with all stations having in-degree 0
    const initialQueue = [];
    inDeg.forEach((deg, idx) => {
      if (deg === 0) {
        initialQueue.push(stationOrder[idx]);
      }
    });
    setQueue([...initialQueue]);

    const result = [];
    const tempInDegrees = [...inDeg];
    const tempQueue = [...initialQueue];
    let step = 0;

    // Process queue step by step with animation
    while (tempQueue.length > 0) {
      // Wait 800ms before processing next step
      await new Promise(resolve => setTimeout(resolve, 800));

      const station = tempQueue.shift();
      result.push(station);
      setActivationSequence([...result]);
      setQueue([...tempQueue]);
      setCurrentStep(step + 1);

      // Find dependencies this station has on others
      const stationIdx = stationOrder.indexOf(station);
      for (let j = 0; j < 14; j++) {
        if (dependencyMatrix[stationIdx][j] === 1) {
          tempInDegrees[j]--;
          
          // If in-degree becomes 0, add to queue
          if (tempInDegrees[j] === 0) {
            tempQueue.push(stationOrder[j]);
          }
        }
      }

      setInDegrees([...tempInDegrees]);
      step++;
    }

    // Check for cycle
    if (result.length !== 14) {
      // Some stations couldn't be processed - cycle detected
      setCycleDetected(true);
      const processed = new Set(result);
      const unprocessed = stationOrder.filter(s => !processed.has(s));
      setCycleStations(unprocessed);
    }

    setIsRunning(false);
    setSequencerComplete(true);
  };

  // Get color based on activation position
  const getActivationColor = (index) => {
    const ratio = index / activationSequence.length;
    if (ratio < 0.33) return '#3b82f6'; // Blue
    if (ratio < 0.66) return '#00f5ff'; // Cyan
    return '#39ff14'; // Green
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="p-4 bg-gradient-to-r from-cyber-dark to-cyber-card border border-cyber-cyan rounded-lg">
        <h2 className="text-2xl font-orbitron font-bold glow-text mb-2 overflow-hidden whitespace-nowrap">
          <span className="inline-block animate-typewriter">LEVEL 2 — DEPENDENCY RESOLUTION</span>
        </h2>
        <p className="text-sm text-cyber-text">Pre-loaded station dependency matrix. Cyan cells indicate active dependencies. Row depends on Column.</p>
      </div>

      {/* Matrix and Graph Container - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Matrix with Zoom Controls */}
        <div className="space-y-4">
          {/* Zoom Controls */}
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => handleZoom('out')}
                className="px-3 py-1 text-xs font-tech-mono bg-cyber-card border border-cyber-cyan rounded hover:bg-cyber-cyan hover:bg-opacity-20 transition-all active:scale-95"
              >
                − ZOOM OUT
              </button>
              <div className="px-4 py-1 text-xs font-tech-mono text-cyber-cyan border border-cyber-cyan rounded bg-cyber-dark">
                {Math.round(zoomLevel * 100)}%
              </div>
              <button
                onClick={() => handleZoom('in')}
                className="px-3 py-1 text-xs font-tech-mono bg-cyber-card border border-cyber-cyan rounded hover:bg-cyber-cyan hover:bg-opacity-20 transition-all active:scale-95"
              >
                + ZOOM IN
              </button>
            </div>
            <div className="text-xs font-tech-mono text-gray-400">
              14×14 DEPENDENCY MATRIX | {stationOrder.length} STATIONS
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="bg-cyber-card border-2 border-cyber-cyan rounded-lg p-2 overflow-auto max-h-[600px]">
          <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>
            <div className="inline-block border-l-2 border-t-2 border-cyber-cyan">
              {/* Header Row (Column labels) */}
              <div className="flex">
                <div className="w-16 h-16 flex-shrink-0"></div>
                {stationOrder.map((station, idx) => (
                  <div
                    key={`header-${station}`}
                    className={`w-12 h-12 flex items-center justify-center text-xs font-orbitron font-bold flex-shrink-0 transition-all ${
                      hoveredCol === idx ? 'bg-purple-900 bg-opacity-40' : ''
                    }`}
                    style={{
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)'
                    }}
                    onMouseEnter={() => setHoveredCol(idx)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <span className="text-cyber-cyan">{station}</span>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {stationOrder.map((station, rowIdx) => (
                <div key={`row-${station}`} className="flex">
                  {/* Row Header */}
                  <div
                    className={`w-16 px-2 py-1 flex flex-col items-start justify-center text-xs font-orbitron font-bold flex-shrink-0 border-r-2 border-cyber-cyan transition-all ${
                      hoveredRow === rowIdx ? 'bg-blue-900 bg-opacity-40' : ''
                    }`}
                    onMouseEnter={() => setHoveredRow(rowIdx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <span className="text-cyber-green font-bold">{station}</span>
                    <span className="text-gray-400 text-xs">σ:{stationSignals[station]}</span>
                  </div>

                  {/* Data Cells */}
                  {stationOrder.map((col, colIdx) => {
                    const isDiagonal = rowIdx === colIdx;
                    const hasValue = dependencyMatrix[rowIdx][colIdx] === 1;
                    const isRowHovered = hoveredRow === rowIdx;
                    const isColHovered = hoveredCol === colIdx;
                    const isInCycle = cycleStations.includes(stationOrder[rowIdx]) || cycleStations.includes(stationOrder[colIdx]);

                    return (
                      <div
                        key={`cell-${rowIdx}-${colIdx}`}
                        className="w-12 h-12 flex items-center justify-center flex-shrink-0 border-r border-b border-gray-700 relative transition-all group"
                        onMouseEnter={(e) => handleCellHover(rowIdx, colIdx, e)}
                        onMouseLeave={handleCellLeave}
                      >
                        <div
                          className={`w-full h-full flex items-center justify-center rounded text-xs font-bold transition-all ${
                            isDiagonal
                              ? 'bg-gray-800 text-gray-600'
                              : hasValue
                              ? `${isInCycle && cycleDetected ? 'bg-red-600 border-2 border-red-500' : 'bg-cyber-cyan bg-opacity-30 border-2 border-cyber-cyan'} text-cyber-cyan ${
                                  isRowHovered || isColHovered ? 'shadow-glow-cyan' : ''
                                }`
                              : `bg-cyber-dark border border-gray-700 ${
                                  isRowHovered || isColHovered ? 'bg-gray-800' : ''
                                }`
                          }`}
                        >
                          {isDiagonal ? (
                            <span className="text-gray-500">╳</span>
                          ) : hasValue ? (
                            <div className="relative flex items-center justify-center">
                              <span>1</span>
                              <div className="absolute w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse" />
                            </div>
                          ) : null}
                        </div>

                        {/* Tooltip */}
                        {tooltip && tooltip.row === station && tooltip.col === stationOrder[colIdx] && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-cyber-cyan rounded text-xs font-tech-mono text-cyber-cyan whitespace-nowrap z-50 shadow-glow-cyan">
                            {tooltip.row} → {tooltip.col}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Network Dependency Graph */}
        <div className="h-[600px]">
          <NetworkDependencyGraph
            dependencyMatrix={dependencyMatrix}
            stationOrder={stationOrder}
            activatedStations={activationSequence}
          />
        </div>
      </div>

      {/* Legend and Info - Full Width Below Matrix & Graph */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-cyber-card border-2 border-cyber-cyan rounded-lg">
            <p className="text-xs text-gray-400 font-tech-mono mb-2">MATRIX LEGEND</p>
            <div className="space-y-2 text-xs font-tech-mono">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cyber-cyan bg-opacity-30 border-2 border-cyber-cyan rounded flex items-center justify-center text-cyber-cyan text-xs">1</div>
                <span className="text-cyber-text">Dependency exists (Row → Col)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-cyber-dark border border-gray-700 rounded flex items-center justify-center text-gray-600">·</div>
                <span className="text-cyber-text">No dependency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center text-gray-600">╳</div>
                <span className="text-cyber-text">Self-reference (disabled)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-cyber-card border-2 border-cyber-orange rounded-lg">
            <p className="text-xs text-gray-400 font-tech-mono mb-2">DEPENDENCY ANALYSIS</p>
            <div className="space-y-2 text-xs font-tech-mono">
              <p className="text-cyber-orange">Pre-loaded dependency structure:</p>
              <ul className="text-cyber-text space-y-1 list-disc list-inside">
                <li>14 stations configured</li>
                <li>Dependencies locked (read-only)</li>
                <li>Topological sort available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Activation Sequencer Button */}
      <button
        onClick={runActivationSequencer}
        disabled={isRunning}
        className="w-full px-6 py-3 bg-cyber-green bg-opacity-20 border-2 border-cyber-green rounded font-orbitron font-bold text-sm text-cyber-green hover:bg-opacity-30 hover:shadow-glow-green transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ⚙️ RUN ACTIVATION SEQUENCER
      </button>

      {/* Activation Sequencer Results */}
      {sequencerComplete && (
        <div className="space-y-4">
            {/* In-Degree Chart */}
            <div className="p-4 bg-cyber-card border-2 border-cyber-cyan rounded-lg">
              <p className="text-xs text-gray-400 font-tech-mono mb-3">IN-DEGREE CHART (Final State)</p>
              <div className="space-y-1">
                {stationOrder.map((station, idx) => (
                  <div key={station} className="flex items-center gap-2">
                    <span className="w-12 text-xs font-orbitron text-cyber-cyan">{station}</span>
                    <div className="flex-1 h-4 bg-cyber-dark border border-gray-700 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green transition-all"
                        style={{ width: `${(inDegrees[idx] || 0) * 10}%` }}
                      />
                    </div>
                    <span className="w-6 text-xs font-tech-mono text-gray-400">{inDegrees[idx] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activation Timeline */}
            <div className="p-4 bg-cyber-card border-2 border-cyber-green rounded-lg">
              <p className="text-xs text-gray-400 font-tech-mono mb-3">ACTIVATION SEQUENCE</p>
              {activationSequence.length > 0 ? (
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {activationSequence.map((station, idx) => (
                    <React.Fragment key={station}>
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full font-orbitron font-bold text-xs border-2 flex-shrink-0 animate-bounce-in"
                        style={{
                          backgroundColor: getActivationColor(idx),
                          borderColor: getActivationColor(idx),
                          color: '#000',
                          animationDelay: `${idx * 100}ms`
                        }}
                      >
                        {idx + 1}
                      </div>
                      {idx < activationSequence.length - 1 && (
                        <div className="w-4 h-1 bg-cyber-cyan flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Running sequencer...</p>
              )}
            </div>

            {/* Result Status */}
            <div className={`p-4 rounded-lg border-2 ${cycleDetected ? 'bg-red-900 bg-opacity-20 border-red-500' : 'bg-cyber-green bg-opacity-20 border-cyber-green'}`}>
              <p className={`text-sm font-orbitron font-bold ${cycleDetected ? 'text-red-400' : 'text-cyber-green'}`}>
                {cycleDetected 
                  ? '❌ CYCLE DETECTED — SYNCHRONIZATION IMPOSSIBLE'
                  : '✅ VALID ACTIVATION SEQUENCE FOUND'}
              </p>
              {cycleDetected && cycleStations.length > 0 && (
                <p className="text-xs text-red-300 font-tech-mono mt-2">
                  Blocking stations: {cycleStations.join(', ')}
                </p>
              )}
              {!cycleDetected && activationSequence.length > 0 && (
                <p className="text-xs text-cyber-green font-tech-mono mt-2 break-all">
                  {activationSequence.join(' → ')}
                </p>
              )}
            </div>

            {/* Summary Card */}
            {sequencerComplete && !cycleDetected && (
              <div className="p-4 bg-gradient-to-br from-cyber-dark to-gray-900 border-2 border-cyber-green rounded-lg font-tech-mono text-xs overflow-x-auto">
                <div className="text-cyber-green mb-3 animate-pulse">
                  ┌─────────────────────────────────────────────────────────┐
                </div>
                <div className="space-y-2 text-cyber-green">
                  <div className="flex justify-between">
                    <span>│ DEPENDENCY RESOLUTION COMPLETE</span>
                    <span>│</span>
                  </div>
                  <div className="flex justify-between">
                    <span>│ Total Stations: {stationOrder.length}</span>
                    <span>│</span>
                  </div>
                  <div className="flex justify-between">
                    <span>│ Total Dependencies: {dependencyMatrix.flat().reduce((a, b) => a + b, 0)}</span>
                    <span>│</span>
                  </div>
                  <div className="flex justify-between">
                    <span>│ Status: SYNCHRONIZED ✅</span>
                    <span>│</span>
                  </div>
                  <div className="flex justify-between">
                    <span>│ Activation Order:</span>
                    <span>│</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span className="text-cyber-cyan">{activationSequence.join(' → ')}</span>
                    <span>│</span>
                  </div>
                </div>
                <div className="text-cyber-green mt-3 animate-pulse">
                  └─────────────────────────────────────────────────────────┘
                </div>
              </div>
            )}
        </div>
        )}

      {/* Completion Button */}
      <button
        onClick={async () => {
          setIsUploading(true);
          // Store activation sequence in window for Level 3 access
          if (!cycleDetected) {
            window.__activationSequence = activationSequence;
          }
          // Simulate upload animation for 1.5 seconds
          await new Promise(resolve => setTimeout(resolve, 1500));
          setIsUploading(false);
          if (onComplete) {
            onComplete({
              dependencyMatrix,
              activationSequence,
              cycleDetected,
              cycleNodes: cycleStations
            });
          }
        }}
        disabled={!sequencerComplete || isUploading}
        className={`w-full px-6 py-3 font-orbitron font-bold text-sm transition-all active:scale-95 ${
          sequencerComplete && !isUploading
            ? 'bg-cyber-green bg-opacity-30 border-2 border-cyber-green rounded text-cyber-green hover:bg-opacity-40 hover:shadow-glow-green cursor-pointer'
            : 'bg-gray-700 border-2 border-gray-600 rounded text-gray-500 cursor-not-allowed opacity-50'
        }`}
      >
        {isUploading 
          ? '⬆️ UPLOADING ACTIVATION SEQUENCE TO LEVEL 3...' 
          : '✓ PROCEED TO LEVEL 3 →'}
      </button>

      {/* Upload Animation Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-cyber-dark bg-opacity-95 flex items-center justify-center z-50">
          <div className="p-6 bg-cyber-card border-2 border-cyber-cyan rounded-lg font-tech-mono text-center">
            <div className="text-cyber-green mb-4 animate-pulse text-lg font-orbitron">
              ⬆️ UPLOADING ACTIVATION SEQUENCE
            </div>
            <div className="text-cyber-cyan text-sm mb-4">
              {activationSequence.join(' → ')}
            </div>
            <div className="space-y-2">
              <div className="text-gray-400 text-xs">
                ▌ Transferring topological order...
              </div>
              <div className="text-gray-400 text-xs">
                ▌ Syncing Level 3 matrix...
              </div>
              <div className="text-gray-400 text-xs">
                ▌ Initializing recovery protocol...
              </div>
            </div>
            <div className="mt-4 flex gap-1 justify-center">
              <div className="w-2 h-8 bg-cyber-green animate-pulse" />
              <div className="w-2 h-8 bg-cyber-cyan animate-pulse" style={{ animationDelay: '100ms' }} />
              <div className="w-2 h-8 bg-cyber-green animate-pulse" style={{ animationDelay: '200ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level2StationDependencyMatrix;
