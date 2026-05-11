import React, { useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';

const Level3MissionReport = ({ activationSequence = [], onComplete }) => {
  const [reportData, setReportData] = useState(null);
  const [hasCycles, setHasCycles] = useState(false);

  // Sorted stations from Level 1
  const sortedStations = ['AK', 'QA', 'FM', 'BT', 'DP', 'RC', 'LM', 'KN', 'PE', 'CU', 'HX', 'ZF', 'SJ', 'VG'];
  // Use activation sequence from Level 2 if available
  const activationOrder = activationSequence.length > 0 ? activationSequence : sortedStations;

  // Mock data for the report
  useEffect(() => {
    // Simulate loading data from previous levels
    const data = {
      missionStartTime: '2026-05-11T09:15:00Z',
      missionEndTime: '2026-05-11T11:41:00Z',
      stationCount: 14,
      signalRange: { min: 14, max: 16 },
      sortedStations: activationOrder,
      inversions: 14,
      maxInversions: 91,
      disorderPercentage: 15,
      disorderLevel: 'LOW',
      totalDependencies: 24,
      cyclesDetected: 0,
      adjList: {}
    };

    // Build adjacency list
    activationOrder.forEach(station => {
      data.adjList[station] = [];
    });

    setReportData(data);
    setHasCycles(data.cyclesDetected > 0);
  }, [activationOrder]);

  const exportAsJSON = () => {
    if (!reportData) return;

    const jsonData = {
      missionReport: {
        timestamp: new Date().toISOString(),
        missionDuration: calculateMissionDuration(),
        stations: reportData.sortedStations,
        disorderAnalysis: {
          inversions: reportData.inversions,
          maxInversions: reportData.maxInversions,
          percentage: reportData.disorderPercentage,
          level: reportData.disorderLevel
        },
        dependencies: {
          total: reportData.totalDependencies,
          cyclesDetected: reportData.cyclesDetected,
          adjacencyList: reportData.adjList
        },
        status: hasCycles ? 'MANUAL_INTERVENTION_REQUIRED' : 'SYNCHRONIZED'
      }
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const calculateMissionDuration = () => {
    if (!reportData) return '00:00:00';
    const start = new Date(reportData.missionStartTime);
    const end = new Date(reportData.missionEndTime);
    const diff = end - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (!reportData) {
    return <div className="text-center text-cyber-cyan">Loading mission report...</div>;
  }

  return (
    <div className="relative animate-fade-in">
      {/* Particle Background */}
      <ParticleBackground />

      {/* DECLASSIFIED Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0">
        <div className="transform -rotate-45 opacity-5">
          <div className="text-9xl font-orbitron font-black text-cyber-orange">DECLASSIFIED</div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 space-y-6">
        {/* Title */}
        <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-card border-2 border-cyber-cyan rounded-lg text-center">
          <p className="text-xs text-gray-500 font-tech-mono tracking-widest mb-2">CLASSIFIED // FOR OFFICIAL USE ONLY</p>
          <h2 className="text-3xl font-orbitron font-bold glow-text mb-2">RECOVERY MISSION FINAL REPORT</h2>
          <p className="text-xs text-gray-500 font-tech-mono">SMART CITY EMERGENCY RECOVERY SYSTEM v1.0</p>
        </div>

        {/* Recovery Status Banner */}
        <div className={`p-4 md:p-6 rounded-lg border-2 text-center transform transition-all ${
          hasCycles
            ? 'bg-red-900 bg-opacity-30 border-red-500'
            : 'bg-cyber-green bg-opacity-20 border-cyber-green animate-pulse-glow'
        }`}>
          <p className="text-lg md:text-2xl font-orbitron font-bold mb-2">
            {hasCycles ? '⚠️ MANUAL INTERVENTION REQUIRED' : '✅ SMART CITY SYNCHRONIZATION RESTORED'}
          </p>
          <p className={`text-sm font-tech-mono ${hasCycles ? 'text-red-300' : 'text-cyber-green'}`}>
            {hasCycles
              ? 'Critical dependency cycles detected. Requires manual resolution before deployment.'
              : 'All systems verified. City infrastructure synchronized and ready for operation.'}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Mission Summary */}
            <div className="p-4 bg-cyber-card border-2 border-cyber-cyan rounded-lg">
              <h3 className="text-lg font-orbitron font-bold text-cyber-cyan mb-4 pb-2 border-b border-cyber-cyan">
                1. MISSION SUMMARY
              </h3>
              <div className="space-y-2 text-sm font-tech-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">MISSION START:</span>
                  <span className="text-cyber-cyan">{new Date(reportData.missionStartTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MISSION END:</span>
                  <span className="text-cyber-cyan">{new Date(reportData.missionEndTime).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TOTAL DURATION:</span>
                  <span className="text-cyber-green">{calculateMissionDuration()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="text-gray-400">STATIONS PROCESSED:</span>
                  <span className="text-cyber-cyan font-bold text-lg">{reportData.stationCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SIGNAL RANGE:</span>
                  <span className="text-cyber-cyan">{reportData.signalRange.min} - {reportData.signalRange.max}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DECODE STATUS:</span>
                  <span className="text-cyber-green">✓ COMPLETE</span>
                </div>
              </div>
            </div>

            {/* Disorder Report */}
            <div className="p-4 bg-cyber-card border-2 border-cyber-orange rounded-lg">
              <h3 className="text-lg font-orbitron font-bold text-cyber-orange mb-4 pb-2 border-b border-cyber-orange">
                3. DISORDER REPORT
              </h3>
              <div className="space-y-2 text-sm font-tech-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">INVERSION COUNT:</span>
                  <span className="text-red-400 font-bold">{reportData.inversions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MAX INVERSIONS:</span>
                  <span className="text-gray-400">{reportData.maxInversions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DISORDER %:</span>
                  <span className={reportData.disorderPercentage > 50 ? 'text-red-400' : 'text-cyber-green'}>
                    {reportData.disorderPercentage}%
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="text-gray-400">DISORDER LEVEL:</span>
                  <span className={`font-bold ${
                    reportData.disorderLevel === 'CRITICAL' ? 'text-red-400' :
                    reportData.disorderLevel === 'MODERATE' ? 'text-cyber-orange' :
                    'text-cyber-green'
                  }`}>
                    {reportData.disorderLevel}
                  </span>
                </div>
                <div className="mt-3 p-2 bg-gray-900 rounded text-xs text-gray-400">
                  Merge sort analysis: {reportData.inversions} misordered pairs detected in initial registry.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Sorted Station Registry */}
            <div className="p-4 bg-cyber-card border-2 border-cyber-green rounded-lg max-h-80 overflow-y-auto">
              <h3 className="text-lg font-orbitron font-bold text-cyber-green mb-3 pb-2 border-b border-cyber-green sticky top-0 bg-cyber-card">
                2. SORTED STATION REGISTRY
              </h3>
              <table className="w-full text-xs font-tech-mono">
                <thead>
                  <tr className="border-b border-gray-700 text-cyber-green">
                    <th className="text-left py-1">#</th>
                    <th className="text-left py-1">STATION</th>
                    <th className="text-right py-1">SIGNAL</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.sortedStations.map((station, idx) => (
                    <tr key={station} className="border-b border-gray-800 hover:bg-gray-900 hover:bg-opacity-30">
                      <td className="py-1 text-gray-500">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="py-1 text-cyber-cyan font-bold">{station}</td>
                      <td className="py-1 text-right text-gray-400">
                        {idx === 0 ? '14' : '15-16'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dependency Report */}
            <div className="p-4 bg-cyber-card border-2 border-cyber-orange rounded-lg">
              <h3 className="text-lg font-orbitron font-bold text-cyber-orange mb-4 pb-2 border-b border-cyber-orange">
                4. DEPENDENCY REPORT
              </h3>
              <div className="space-y-2 text-sm font-tech-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">TOTAL DEPENDENCIES:</span>
                  <span className="text-cyber-cyan font-bold">{reportData.totalDependencies}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CYCLES DETECTED:</span>
                  <span className={reportData.cyclesDetected > 0 ? 'text-red-400 font-bold' : 'text-cyber-green'}>
                    {reportData.cyclesDetected > 0 ? `${reportData.cyclesDetected} ⚠` : '✓ NONE'}
                  </span>
                </div>
                <div className="mt-3 p-2 bg-gray-900 rounded text-xs text-gray-500">
                  <p className="text-gray-400 mb-1">ADJACENCY LIST:</p>
                  <div className="text-gray-600 font-mono text-xs leading-relaxed">
                    {Object.entries(reportData.adjList)
                      .map(([station, deps]) => `${station}→${deps.length ? deps.join(',') : 'ø'}`)
                      .join('  ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={exportAsJSON}
            className="px-6 py-3 bg-cyber-orange bg-opacity-20 border-2 border-cyber-orange rounded font-orbitron font-bold text-sm text-cyber-orange hover:bg-opacity-30 transition-all active:scale-95"
          >
            📥 EXPORT REPORT (JSON)
          </button>
          <button
            onClick={() => onComplete()}
            className="px-6 py-3 bg-cyber-green bg-opacity-20 border-2 border-cyber-green rounded font-orbitron font-bold text-sm text-cyber-green hover:bg-opacity-30 transition-all active:scale-95"
          >
            ✓ MISSION COMPLETE
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center border-t border-gray-700">
          <p className="text-xs text-gray-600 font-tech-mono">
            REPORT GENERATED: {new Date().toLocaleString()} | CLASSIFICATION: DECLASSIFIED
          </p>
        </div>
      </div>
    </div>
  );
};

export default Level3MissionReport;
