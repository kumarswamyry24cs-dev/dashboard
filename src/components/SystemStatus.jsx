import React, { useState, useEffect } from 'react';
import { GaugeChart, StatusBadge, Alert } from './UIComponents';

const SystemStatus = () => {
  const [systemData, setSystemData] = useState({
    powerGrid: 72,
    waterSupply: 65,
    communications: 89,
    emergencyServices: 95,
    transport: 54,
    healthcare: 88,
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData(prev => ({
        powerGrid: Math.max(30, Math.min(100, prev.powerGrid + (Math.random() - 0.5) * 5)),
        waterSupply: Math.max(20, Math.min(100, prev.waterSupply + (Math.random() - 0.5) * 3)),
        communications: Math.max(40, Math.min(100, prev.communications + (Math.random() - 0.5) * 2)),
        emergencyServices: Math.max(50, Math.min(100, prev.emergencyServices + (Math.random() - 0.5) * 1)),
        transport: Math.max(25, Math.min(100, prev.transport + (Math.random() - 0.5) * 4)),
        healthcare: Math.max(60, Math.min(100, prev.healthcare + (Math.random() - 0.5) * 2)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Grid */}
        <div className="p-4 bg-cyber-card border border-cyber-cyan rounded hover:shadow-glow-cyan transition-all">
          <h3 className="font-orbitron text-sm mb-4 glow-text">⚡ POWER GRID</h3>
          <GaugeChart label="Grid Load" value={Math.round(systemData.powerGrid)} max={100} accentColor="cyan" warning={75} />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>• Primary substations: ONLINE</p>
            <p>• Backup generators: READY</p>
            <p>• Distribution nodes: 47/50</p>
          </div>
        </div>

        {/* Water Supply */}
        <div className="p-4 bg-cyber-card border border-cyber-green rounded hover:shadow-glow-green transition-all">
          <h3 className="font-orbitron text-sm mb-4 glow-text-green">💧 WATER SUPPLY</h3>
          <GaugeChart label="Tank Level" value={Math.round(systemData.waterSupply)} max={100} accentColor="green" warning={40} />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>• Treatment plants: 3/4 ACTIVE</p>
            <p>• Pressure: NOMINAL</p>
            <p>• Quality: SAFE</p>
          </div>
        </div>

        {/* Communications Network */}
        <div className="p-4 bg-cyber-card border border-cyber-orange rounded hover:shadow-glow-orange transition-all">
          <h3 className="font-orbitron text-sm mb-4 glow-text-orange">📡 COMMUNICATIONS</h3>
          <GaugeChart label="Network Load" value={Math.round(systemData.communications)} max={100} accentColor="orange" warning={85} />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>• Towers active: 142/145</p>
            <p>• Bandwidth utilization: 71%</p>
            <p>• Emergency broadcast: READY</p>
          </div>
        </div>

        {/* Emergency Services */}
        <div className="p-4 bg-cyber-card border border-cyber-green rounded hover:shadow-glow-green transition-all">
          <h3 className="font-orbitron text-sm mb-4 glow-text-green">🚨 EMERGENCY SERVICES</h3>
          <GaugeChart label="Response Rate" value={Math.round(systemData.emergencyServices)} max={100} accentColor="green" warning={70} />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>• Fire dept dispatch: 8.2 min avg</p>
            <p>• Ambulances deployed: 34</p>
            <p>• Police units active: 127</p>
          </div>
        </div>

        {/* Transportation Network */}
        <div className="p-4 bg-cyber-card border border-cyber-cyan rounded hover:shadow-glow-cyan transition-all">
          <h3 className="font-orbitron text-sm mb-4 glow-text">🚗 TRANSPORT NETWORK</h3>
          <GaugeChart label="System Operational" value={Math.round(systemData.transport)} max={100} accentColor="cyan" warning={60} />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>• Metro status: 6/8 lines OPEN</p>
            <p>• Bus fleet: 287/310 active</p>
            <p>• Traffic flow: MODERATE</p>
          </div>
        </div>

        {/* Healthcare System */}
        <div className="p-4 bg-cyber-card border border-cyber-green rounded hover:shadow-glow-green transition-all">
          <h3 className="font-orbitron text-sm mb-4 glow-text-green">🏥 HEALTHCARE SYSTEM</h3>
          <GaugeChart label="Bed Availability" value={Math.round(systemData.healthcare)} max={100} accentColor="green" warning={75} />
          <div className="mt-4 text-xs text-gray-400 space-y-1">
            <p>• Hospitals operational: 12/12</p>
            <p>• ICU beds available: 89</p>
            <p>• Supply status: STABLE</p>
          </div>
        </div>
      </div>

      {/* Critical Alerts Section */}
      <div className="p-4 bg-cyber-card border border-red-500 rounded">
        <h3 className="font-orbitron text-sm mb-4 glow-text-orange">🔴 CRITICAL ALERTS & INCIDENTS</h3>
        <div className="space-y-3">
          <Alert
            severity="critical"
            title="SECTOR 7-B: POWER OUTAGE"
            message="Localized power failure detected in residential zone 7-B. Affecting ~8,400 residents. Repair crews dispatched. ETA: 45 minutes."
            icon="⚡"
          />
          <Alert
            severity="warning"
            title="WATER MAIN RUPTURE"
            message="Water main break detected on Central Avenue. Traffic diverted. Repair operations in progress. Est. completion: 3 hours."
            icon="💧"
          />
          <Alert
            severity="warning"
            title="COMMUNICATION TOWER DOWN"
            message="Cell tower #047 in downtown area offline due to maintenance. Coverage redirected. Expected restoration: 22:30."
            icon="📡"
          />
          <Alert
            severity="success"
            title="INCIDENT RESOLVED"
            message="Traffic accident on Route 5 cleared. Normal flow restored. No injuries reported."
            icon="✓"
          />
        </div>
      </div>

      {/* Status Overview */}
      <div className="p-4 bg-cyber-card border border-cyber-cyan rounded">
        <h3 className="font-orbitron text-sm mb-4 glow-text">SYSTEM STATUS OVERVIEW</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="flex items-center gap-2">
            <StatusBadge status="active" label="POWER" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="warning" label="WATER" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="active" label="COMMS" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="active" label="EMERGENCY" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="warning" label="TRANSPORT" />
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="active" label="HEALTH" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
