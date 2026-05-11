import React, { useState } from 'react';

const Level3FinalReport = ({ onComplete }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title Section */}
      <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-card border border-cyber-green rounded-lg">
        <h2 className="text-3xl font-orbitron font-bold glow-text-green mb-2">LEVEL 3: FINAL REPORT</h2>
        <p className="text-cyber-text">Review the emergency recovery assessment. All systems have been analyzed and verified. Confirm to complete the mission.</p>
      </div>

      {/* Mission Summary */}
      <div className="p-6 bg-cyber-card border-2 border-cyber-green rounded-lg">
        <h3 className="font-orbitron text-lg mb-4 glow-text-green">📊 RECOVERY ASSESSMENT REPORT</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-cyber-dark bg-opacity-50 rounded border border-cyber-cyan">
              <p className="text-xs text-gray-400 font-tech-mono mb-2">MISSION TIMELINE</p>
              <p className="text-2xl font-tech-mono text-cyber-cyan font-bold">2h 47m 32s</p>
              <p className="text-xs text-gray-500 mt-1">Total assessment time</p>
            </div>
            <div className="p-4 bg-cyber-dark bg-opacity-50 rounded border border-cyber-green">
              <p className="text-xs text-gray-400 font-tech-mono mb-2">SYSTEMS ANALYZED</p>
              <p className="text-2xl font-tech-mono text-cyber-green font-bold">6/6</p>
              <p className="text-xs text-gray-500 mt-1">All critical systems verified</p>
            </div>
            <div className="p-4 bg-cyber-dark bg-opacity-50 rounded border border-cyber-orange">
              <p className="text-xs text-gray-400 font-tech-mono mb-2">INCIDENTS PROCESSED</p>
              <p className="text-2xl font-tech-mono text-cyber-orange font-bold">847</p>
              <p className="text-xs text-gray-500 mt-1">Real-time incidents logged</p>
            </div>
            <div className="p-4 bg-cyber-dark bg-opacity-50 rounded border border-cyber-cyan">
              <p className="text-xs text-gray-400 font-tech-mono mb-2">RECOVERY RATE</p>
              <p className="text-2xl font-tech-mono text-cyber-cyan font-bold">94.2%</p>
              <p className="text-xs text-gray-500 mt-1">Infrastructure operational</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="p-6 bg-cyber-card border-2 border-cyber-cyan rounded-lg">
          <h3 className="font-orbitron text-sm mb-4 glow-text">⚙️ SYSTEM STATUS REPORT</h3>
          <div className="space-y-3 text-xs font-tech-mono">
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-green">
              <span>✓ Power Grid</span>
              <span className="text-cyber-green">OPTIMAL</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-orange">
              <span>⚠ Water Supply</span>
              <span className="text-cyber-orange">DEGRADED</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-green">
              <span>✓ Communications</span>
              <span className="text-cyber-green">OPTIMAL</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-green">
              <span>✓ Emergency Services</span>
              <span className="text-cyber-green">OPTIMAL</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-orange">
              <span>⚠ Transportation</span>
              <span className="text-cyber-orange">LIMITED</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-green">
              <span>✓ Healthcare</span>
              <span className="text-cyber-green">OPTIMAL</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 bg-cyber-card border-2 border-cyber-orange rounded-lg">
          <h3 className="font-orbitron text-sm mb-4 glow-text-orange">🎯 ACTION RECOMMENDATIONS</h3>
          <div className="space-y-3 text-xs font-tech-mono">
            <div className="p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-green">
              <p className="text-cyber-green font-bold">IMMEDIATE</p>
              <p className="text-gray-300">Maintain power grid stability • 4 resources deployed</p>
            </div>
            <div className="p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-orange">
              <p className="text-cyber-orange font-bold">SHORT-TERM (1-6H)</p>
              <p className="text-gray-300">Repair water main rupture • Activate backup systems</p>
            </div>
            <div className="p-2 bg-cyber-dark bg-opacity-50 rounded border-l-2 border-cyber-blue">
              <p className="text-cyber-cyan font-bold">MID-TERM (6-24H)</p>
              <p className="text-gray-300">Restore transport network • Equipment maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-card border-2 border-cyber-green rounded-lg">
        <h3 className="font-orbitron text-sm mb-4 glow-text-green">📝 EXECUTIVE SUMMARY</h3>
        <p className="text-sm text-cyber-text leading-relaxed mb-4">
          The Smart City Emergency Recovery System has successfully completed a comprehensive assessment of all critical infrastructure. 
          The multi-level analysis, spanning signal decoding and dependency mapping, confirms 94.2% system operational status. 
          Power, communications, emergency services, and healthcare systems are performing optimally. Water supply and transportation 
          networks require immediate attention and resource allocation.
        </p>
        <div className="p-4 bg-cyber-card rounded border border-cyber-green">
          <p className="text-xs font-tech-mono text-cyber-green mb-2">AUTHORIZATION STATUS</p>
          <p className="text-lg font-orbitron text-cyber-green">✓ MISSION APPROVED FOR DEPLOYMENT</p>
        </div>
      </div>

      {/* Completion Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-cyber-card border border-cyber-cyan rounded text-center">
          <div className="text-3xl font-tech-mono text-cyber-cyan font-bold">100%</div>
          <div className="text-xs text-gray-400 font-tech-mono mt-2">LEVELS COMPLETED</div>
        </div>
        <div className="p-4 bg-cyber-card border border-cyber-green rounded text-center">
          <div className="text-3xl font-tech-mono text-cyber-green font-bold">94.2%</div>
          <div className="text-xs text-gray-400 font-tech-mono mt-2">RECOVERY STATUS</div>
        </div>
        <div className="p-4 bg-cyber-card border border-cyber-orange rounded text-center">
          <div className="text-3xl font-tech-mono text-cyber-orange font-bold">847</div>
          <div className="text-xs text-gray-400 font-tech-mono mt-2">INCIDENTS HANDLED</div>
        </div>
      </div>

      {/* Confirmation Section */}
      <div className="p-6 bg-cyber-card border-2 border-cyber-green rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-6 h-6 rounded border-2 border-cyber-green cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <p className="font-orbitron text-sm text-cyber-green">I confirm receipt and authorization of this emergency recovery assessment report.</p>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!confirmed}
          className={`w-full px-6 py-3 font-orbitron font-bold text-sm rounded border-2 transition-all ${
            confirmed
              ? 'border-cyber-green text-cyber-green bg-cyber-green bg-opacity-10 hover:shadow-glow-green active:scale-95'
              : 'border-gray-600 text-gray-500 opacity-50 cursor-not-allowed'
          }`}
        >
          {confirmed ? '✓ CONFIRM & COMPLETE MISSION' : 'CHECK BOX TO CONFIRM'}
        </button>
      </div>
    </div>
  );
};

export default Level3FinalReport;
