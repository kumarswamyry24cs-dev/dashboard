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
  
  // Use activation sequence from Level 2 if available
  const activationOrder = activationSequence.length > 0 ? activationSequence : ['AK', 'QA', 'FM', 'BT', 'DP', 'RC', 'LM', 'KN', 'PE', 'CU', 'HX', 'ZF', 'SJ', 'VG'];

  // Generate weighted connectivity matrix based on activation sequence order
  const generateConnectivityMatrix = () => {
    const size = activationOrder.length;
    const matrix = Array(size).fill(null).map(() => Array(size).fill(0));
    
    // Create weighted connections based on dependency relationships
    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        const weight = Math.max(1, 10 - Math.abs(j - i));
        matrix[i][j] = weight;
        matrix[j][i] = Math.floor(weight * 0.7);
      }
    }
    
    return matrix;
  };

  const connectivityMatrix = generateConnectivityMatrix();

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
                    const bgColor =
                      weight === 0
                        ? 'bg-gray-900'
                        : weight <= 3
                        ? 'bg-blue-900'
                        : weight <= 6
                        ? 'bg-cyan-900'
                        : 'bg-green-900';

                    return (
                      <td
                        key={`${rowStation}-${colStation}`}
                        className={`w-8 h-8 border border-gray-700 flex items-center justify-center cursor-pointer hover:border-cyber-cyan transition-colors ${bgColor}`}
                        title={`${rowStation} → ${colStation}: ${weight}`}
                      >
                        {weight > 0 && (
                          <span className={`text-xs font-bold ${weight > 7 ? 'text-cyber-green' : 'text-cyber-cyan'}`}>
                            {weight}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-gray-900 rounded text-sm font-tech-mono text-gray-400">
          <div className="flex gap-4">
            <div><span className="text-cyber-cyan">■ Dark:</span> No connection</div>
            <div><span className="text-blue-400">■ Blue:</span> Weak (1-3)</div>
            <div><span className="text-cyan-400">■ Cyan:</span> Medium (4-6)</div>
            <div><span className="text-green-400">■ Green:</span> Strong (7-10)</div>
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
          <div className="text-sm font-tech-mono text-gray-400 mb-2">TOTAL LINK WEIGHT</div>
          <div className="text-3xl font-orbitron font-bold text-cyber-cyan">
            {connectivityMatrix.flat().reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-2">Sum of all weighted connections</div>
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
