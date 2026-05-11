import React, { useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';
import Level3Transition from './Level3_Transition';
import useAppStore from '../store/appStore';

const Level3MissionReport = ({ onComplete }) => {
  const [reportData, setReportData] = useState(null);
  const [hasCycles, setHasCycles] = useState(false);
  const [showTransition, setShowTransition] = useState(true);

  // Read from global store
  const activationSequence = useAppStore((state) => state.activationSequence);
  const cycleDetected = useAppStore((state) => state.cycleDetected);
  const dependencyMatrix = useAppStore((state) => state.dependencyMatrix);
  
  // Use activation sequence from Level 2 if available, otherwise use exact matrix order
  const activationOrder = activationSequence.length > 0 ? activationSequence : ['DP', 'AK', 'RC', 'QA', 'BT', 'FM', 'PE', 'CU', 'LM', 'KN', 'SJ', 'VG', 'HX', 'ZF'];

  // Hardcoded symmetric weight matrix
  // Stations ordered: DP,AK,RC,QA,BT,FM,PE,CU,LM,KN,SJ,VG,HX,ZF
  const connectivityMatrix = [
    [0,  3,  9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],  // DP
    [3,  0,  4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],  // AK
    [9,  4,  0,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],  // RC
    [-1,10,  2,  0,  5, -1, -1, -1, -1, -1, -1, -1, -1, -1],  // QA
    [-1,-1, -1,  5,  0,  6, 11, -1, -1, -1, -1, -1, -1, -1],  // BT
    [-1,-1, -1, -1,  6,  0,  3, -1, -1, -1, -1, -1, -1, -1],  // FM
    [-1,-1, -1, -1, 11,  3,  0,  4, -1, -1, -1, -1, -1, -1],  // PE
    [-1,-1, -1, -1, -1, -1,  4,  0,  2, -1, -1, -1, -1, -1],  // CU
    [-1,-1, -1, -1, -1, -1, -1,  2,  0,  5,  8, -1, -1, -1],  // LM
    [-1,-1, -1, -1, -1, -1, -1, -1,  5,  0,  3, -1, -1, -1],  // KN
    [-1,-1, -1, -1, -1, -1, -1, -1,  8,  3,  0,  4, -1, -1],  // SJ
    [-1,-1, -1, -1, -1, -1, -1, -1, -1, -1,  4,  0,  2, -1],  // VG
    [-1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  2,  0,  7],  // HX
    [-1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  7,  0],  // ZF
  ];

  // Initialize report data
  useEffect(() => {
    const data = {
      stationCount: 14,
      signalRange: { min: 14, max: 16 },
      sortedStations: activationOrder,
      totalDependencies: dependencyMatrix.length > 0 ? dependencyMatrix.flat().reduce((a, b) => a + b, 0) : 24,
      cyclesDetected: cycleDetected ? 1 : 0,
      connectivityMatrix: connectivityMatrix
    };

    setReportData(data);
    setHasCycles(cycleDetected);
  }, [activationOrder, cycleDetected, dependencyMatrix]);

  if (!reportData) {
    return <div className="text-center text-cyber-cyan">Loading mission report...</div>;
  }

  // Show transition screen first
  if (showTransition) {
    return <Level3Transition onTransitionComplete={() => setShowTransition(false)} />;
  }

  return (
    <div className="relative animate-fade-in space-y-6 p-6">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Network Reconstruction Title */}
      <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-card border-b-2 border-cyber-cyan">
        <h2 className="text-3xl font-orbitron font-bold glow-text mb-2">LEVEL 3 — NETWORK RECONSTRUCTION</h2>
        <p className="text-sm text-cyber-text">Weighted connectivity matrix reconstructed from activation sequence</p>
      </div>

      {/* Connectivity Matrix */}
      <div className="p-6 bg-cyber-card border-2 border-cyber-cyan rounded-lg overflow-x-auto">
        <h3 className="text-lg font-orbitron font-bold text-cyber-cyan mb-4">CONNECTIVITY MATRIX (14×14)</h3>
        <div className="inline-block min-w-full">
          <table className="border-collapse text-xs font-tech-mono">
            <thead>
              <tr>
                <th className="w-12 h-8 border border-gray-700 bg-gray-900 text-gray-500">→</th>
                {activationOrder.map((station) => (
                  <th key={station} className="w-8 h-8 border border-gray-700 bg-gray-900 text-cyber-cyan font-bold">
                    {station}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activationOrder.map((rowStation, rowIdx) => (
                <tr key={rowStation}>
                  <th className="border border-gray-700 bg-gray-900 text-cyber-cyan font-bold px-2">
                    {rowStation}
                  </th>
                  {activationOrder.map((colStation, colIdx) => {
                    const weight = connectivityMatrix[rowIdx][colIdx];
                    
                    // Determine cell styling based on weight value
                    let bgColor = 'bg-gray-900';
                    let textColor = 'text-gray-600';
                    let glowClass = '';
                    let cellSymbol = '';
                    let tooltipText = '';

                    if (weight === 0) {
                      // Diagonal cells (0)
                      bgColor = 'bg-gray-900';
                      textColor = 'text-gray-600';
                      cellSymbol = '—';
                      tooltipText = 'Diagonal';
                    } else if (weight === -1) {
                      // No connection cells (-1)
                      bgColor = 'bg-gray-950';
                      textColor = 'text-gray-700';
                      cellSymbol = '∅';
                      tooltipText = 'No connection';
                    } else if (weight >= 1 && weight <= 3) {
                      // Low cost (1-3): bright cyan glow
                      bgColor = 'bg-cyan-900 bg-opacity-40';
                      textColor = 'text-cyan-300 font-bold';
                      glowClass = 'shadow-lg shadow-cyan-500 shadow-opacity-50';
                      cellSymbol = weight.toString();
                      tooltipText = `Repair cost: ${weight} energy units`;
                    } else if (weight >= 4 && weight <= 6) {
                      // Medium cost (4-6): yellow glow
                      bgColor = 'bg-yellow-900 bg-opacity-40';
                      textColor = 'text-yellow-300 font-bold';
                      glowClass = 'shadow-lg shadow-yellow-500 shadow-opacity-50';
                      cellSymbol = weight.toString();
                      tooltipText = `Repair cost: ${weight} energy units`;
                    } else if (weight >= 7 && weight <= 11) {
                      // High cost (7-11): orange-red glow
                      bgColor = 'bg-orange-900 bg-opacity-40';
                      textColor = 'text-orange-300 font-bold';
                      glowClass = 'shadow-lg shadow-orange-500 shadow-opacity-50';
                      cellSymbol = weight.toString();
                      tooltipText = `Repair cost: ${weight} energy units`;
                    }

                    return (
                      <td
                        key={`${rowStation}-${colStation}`}
                        className={`w-8 h-8 border border-gray-700 flex items-center justify-center cursor-pointer hover:border-cyan-400 transition-all ${bgColor} ${glowClass}`}
                        title={tooltipText}
                      >
                        <span className={textColor}>{cellSymbol}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 space-y-3">
          <div className="p-3 bg-gray-900 rounded text-sm font-tech-mono text-gray-400">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-600 bg-gray-950"></div>
                <span>No Path (∅)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-600 bg-gray-900"></div>
                <span>Diagonal (—)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-cyan-400 bg-cyan-900 bg-opacity-40"></div>
                <span>Low (1-3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-yellow-400 bg-yellow-900 bg-opacity-40"></div>
                <span>Medium (4-6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-orange-400 bg-orange-900 bg-opacity-40"></div>
                <span>High (7-11)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-cyber-card border-2 border-cyber-green rounded-lg">
          <div className="text-sm font-tech-mono text-gray-400 mb-2">NETWORK DENSITY</div>
          <div className="text-3xl font-orbitron font-bold text-cyber-green">
            {((connectivityMatrix.flat().filter(v => v > 0).length / (14 * 14)) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">Of possible connections active</div>
        </div>

        <div className="p-4 bg-cyber-card border-2 border-cyber-cyan rounded-lg">
          <div className="text-sm font-tech-mono text-gray-400 mb-2">TOTAL REPAIR COST</div>
          <div className="text-3xl font-orbitron font-bold text-cyber-cyan">
            {connectivityMatrix.flat().filter(v => v > 0).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-2">Sum of all energy units</div>
        </div>

        <div className="p-4 bg-cyber-card border-2 border-cyber-orange rounded-lg">
          <div className="text-sm font-tech-mono text-gray-400 mb-2">RECONSTRUCTION STATUS</div>
          <div className="text-3xl font-orbitron font-bold text-cyber-orange">
            {hasCycles ? '⚠️ INCOMPLETE' : '✅ COMPLETE'}
          </div>
          <div className="text-xs text-gray-500 mt-2">{hasCycles ? 'Cycles detected' : 'All connections verified'}</div>
        </div>
      </div>

      {/* Mission Complete Button */}
      <div className="flex justify-center pb-6">
        <button
          onClick={() => onComplete()}
          className="px-8 py-4 bg-cyber-green bg-opacity-30 border-2 border-cyber-green rounded font-orbitron font-bold text-lg text-cyber-green hover:bg-opacity-40 hover:shadow-glow-green transition-all active:scale-95"
        >
          ✓ NETWORK RECONSTRUCTION COMPLETE — RETURN TO BASE
        </button>
      </div>
    </div>
  );
};

export default Level3MissionReport;
