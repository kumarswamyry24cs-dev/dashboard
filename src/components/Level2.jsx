import React, { useState, useEffect } from 'react';

const Level2DependencyMatrix = ({ onComplete }) => {
  const [dependencies, setDependencies] = useState([
    { id: 1, system: 'Power Grid', depends: 'Fuel Supply', resolved: false },
    { id: 2, system: 'Water System', depends: 'Pressure Control', resolved: false },
    { id: 3, system: 'Communications', depends: 'Network Hub', resolved: false },
    { id: 4, system: 'Transport', depends: 'Signal Control', resolved: false },
    { id: 5, system: 'Healthcare', depends: 'Power Supply', resolved: false },
    { id: 6, system: 'Emergency Response', depends: 'Communications', resolved: false },
  ]);

  const [analyzing, setAnalyzing] = useState(false);

  // Auto-analyze dependencies
  useEffect(() => {
    if (!analyzing) return;

    const unsolvedIndex = dependencies.findIndex(d => !d.resolved);
    if (unsolvedIndex === -1) {
      setAnalyzing(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setDependencies(prev =>
        prev.map((d, idx) => idx === unsolvedIndex ? { ...d, resolved: true } : d)
      );
    }, 600);

    return () => clearTimeout(timer);
  }, [analyzing, dependencies, onComplete]);

  const handleAnalyzeClick = () => {
    setAnalyzing(true);
  };

  const handleToggleDependency = (id) => {
    setDependencies(prev =>
      prev.map(d => d.id === id ? { ...d, resolved: !d.resolved } : d)
    );
  };

  const resolvedCount = dependencies.filter(d => d.resolved).length;
  const allResolved = resolvedCount === dependencies.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Section */}
      <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-card border border-cyber-cyan rounded-lg">
        <h2 className="text-3xl font-orbitron font-bold glow-text mb-2">LEVEL 2: DEPENDENCY MATRIX</h2>
        <p className="text-cyber-text">Resolve all system dependencies to ensure coordinated recovery operations. All systems must be mapped and verified.</p>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-cyber-card border border-cyber-orange rounded-lg">
        <p className="text-sm font-tech-mono text-cyber-orange mb-2">🔗 DEPENDENCY MAPPING</p>
        <p className="text-xs text-cyber-text">
          {analyzing ? 'Analyzing dependencies...' : allResolved ? '✓ All dependencies resolved!' : `${resolvedCount}/${dependencies.length} dependencies verified.`}
        </p>
      </div>

      {/* Dependency Matrix Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full p-4 bg-cyber-card border border-cyber-cyan rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-cyber-cyan">
                <th className="text-left py-3 px-4 font-orbitron text-sm text-cyber-cyan">#</th>
                <th className="text-left py-3 px-4 font-orbitron text-sm text-cyber-cyan">PRIMARY SYSTEM</th>
                <th className="text-left py-3 px-4 font-orbitron text-sm text-cyber-cyan">DEPENDS ON</th>
                <th className="text-center py-3 px-4 font-orbitron text-sm text-cyber-cyan">STATUS</th>
                <th className="text-center py-3 px-4 font-orbitron text-sm text-cyber-cyan">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-cyan divide-opacity-30">
              {dependencies.map((dep, idx) => (
                <tr
                  key={dep.id}
                  className={`transition-all hover:bg-cyber-dark hover:bg-opacity-50 ${
                    dep.resolved ? 'opacity-100' : ''
                  }`}
                >
                  <td className="py-4 px-4 font-tech-mono text-sm text-gray-400">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="py-4 px-4 font-tech-mono text-sm text-cyber-cyan">{dep.system}</td>
                  <td className="py-4 px-4 font-tech-mono text-sm text-gray-300">{dep.depends}</td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-orbitron font-bold ${
                        dep.resolved
                          ? 'bg-cyber-green bg-opacity-30 text-cyber-green border border-cyber-green'
                          : 'bg-cyber-orange bg-opacity-30 text-cyber-orange border border-cyber-orange'
                      }`}
                    >
                      {dep.resolved ? 'RESOLVED' : 'PENDING'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => !analyzing && handleToggleDependency(dep.id)}
                      disabled={analyzing}
                      className={`px-3 py-1 rounded text-xs font-orbitron border-2 transition-all ${
                        dep.resolved
                          ? 'border-cyber-green text-cyber-green hover:shadow-glow-green'
                          : 'border-cyber-cyan text-cyber-cyan hover:shadow-glow-cyan'
                      } ${analyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {dep.resolved ? '✓' : 'VERIFY'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dependency Chain Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 bg-cyber-card border border-cyber-cyan rounded-lg">
          <h3 className="font-orbitron text-sm mb-4 glow-text">🔀 CHAIN ANALYSIS</h3>
          <div className="space-y-2 text-xs font-tech-mono text-gray-400">
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded">
              <span>Primary Dependencies</span>
              <span className="text-cyber-cyan font-bold">{dependencies.length}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded">
              <span>Critical Path</span>
              <span className="text-cyber-orange font-bold">Power → Systems</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded">
              <span>Bottlenecks</span>
              <span className="text-red-400 font-bold">2 detected</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cyber-card border border-cyber-green rounded-lg">
          <h3 className="font-orbitron text-sm mb-4 glow-text-green">✓ RESOLUTION STATUS</h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-gray-400">Verification</span>
                <span className="text-cyber-green font-bold">{resolvedCount}/{dependencies.length}</span>
              </div>
              <div className="w-full h-2 bg-cyber-dark border border-cyber-green rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyber-green to-emerald-400 transition-all"
                  style={{ width: `${(resolvedCount / dependencies.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAnalyzeClick}
          disabled={analyzing || allResolved}
          className={`px-6 py-3 font-orbitron font-bold text-sm rounded border-2 transition-all ${
            analyzing || allResolved
              ? 'border-cyber-cyan text-cyber-cyan opacity-50 cursor-not-allowed'
              : 'border-cyber-green text-cyber-green hover:shadow-glow-green active:scale-95'
          }`}
        >
          {allResolved ? '✓ LEVEL COMPLETE' : analyzing ? '⟳ ANALYZING...' : 'START ANALYSIS'}
        </button>
      </div>
    </div>
  );
};

export default Level2DependencyMatrix;
