import React, { useState, useEffect } from 'react';
import { MapGrid, DataCard } from './UIComponents';

const CityMap = () => {
  const [mapSectors, setMapSectors] = useState(
    [...Array(16)].map(() => ({
      status: Math.random() > 0.8 ? 'critical' : Math.random() > 0.7 ? 'warning' : 'normal',
      value: Math.floor(Math.random() * 100)
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMapSectors(prev => prev.map(() => ({
        status: Math.random() > 0.85 ? 'critical' : Math.random() > 0.75 ? 'warning' : 'normal',
        value: Math.floor(Math.random() * 100)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* City Map */}
      <div className="p-4 bg-cyber-card border border-cyber-cyan rounded">
        <h3 className="font-orbitron text-sm mb-4 glow-text">🗺️ CITY DISTRICT MAP</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MapGrid data={mapSectors} />
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p className="font-orbitron text-cyan-400">GRID LEGEND:</p>
              <p>🟢 Normal • 🟠 Warning • 🔴 Critical</p>
              <p>Values: System Health % per sector</p>
            </div>
          </div>
          <div className="space-y-3">
            <DataCard title="Total Sectors" value="16" unit="online" />
            <DataCard title="Critical Zones" value="2" unit="" status="critical" />
            <DataCard title="Warning Zones" value="3" unit="" status="warning" />
            <DataCard title="Normal Status" value="11" unit="" status="normal" />
          </div>
        </div>
      </div>

      {/* Detailed Sector Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-cyber-card border border-cyber-green rounded">
          <h3 className="font-orbitron text-sm mb-4 glow-text-green">📊 AFFECTED ZONES</h3>
          <div className="space-y-2 text-xs font-tech-mono">
            <div className="flex justify-between p-2 bg-red-900 bg-opacity-30 rounded border border-red-500">
              <span>SECTOR 7-B</span>
              <span className="text-red-400">CRITICAL</span>
            </div>
            <div className="flex justify-between p-2 bg-orange-900 bg-opacity-30 rounded border border-cyber-orange">
              <span>SECTOR 12-A</span>
              <span className="text-cyber-orange">WARNING</span>
            </div>
            <div className="flex justify-between p-2 bg-orange-900 bg-opacity-30 rounded border border-cyber-orange">
              <span>SECTOR 5-C</span>
              <span className="text-cyber-orange">WARNING</span>
            </div>
            <div className="flex justify-between p-2 bg-green-900 bg-opacity-30 rounded border border-cyber-green">
              <span>SECTOR 3-A</span>
              <span className="text-cyber-green">NOMINAL</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-cyber-card border border-cyber-orange rounded">
          <h3 className="font-orbitron text-sm mb-4 glow-text-orange">📍 POPULATION IMPACT</h3>
          <div className="space-y-3 text-xs font-tech-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span>Affected Residents</span>
                <span className="text-cyber-orange">18,940</span>
              </div>
              <div className="w-full h-2 bg-cyber-card border border-cyber-orange rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyber-orange to-red-500 w-1/4" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Evacuation Orders</span>
                <span className="text-red-400">2,150</span>
              </div>
              <div className="w-full h-2 bg-cyber-card border border-red-500 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-500 w-1/12" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Safe Zones Activated</span>
                <span className="text-cyber-green">7</span>
              </div>
              <div className="w-full h-2 bg-cyber-card border border-cyber-green rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyber-green to-emerald-400 w-7/12" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-cyber-card border border-cyber-green rounded">
        <h3 className="font-orbitron text-sm mb-4 glow-text-green">⚙️ EMERGENCY CONTROLS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <button className="px-3 py-2 bg-cyber-green text-cyber-dark font-orbitron text-xs rounded hover:shadow-glow-green transition-all active:scale-95">
            ACTIVATE PROTOCOLS
          </button>
          <button className="px-3 py-2 border border-cyber-cyan text-cyber-cyan font-orbitron text-xs rounded hover:shadow-glow-cyan transition-all active:scale-95">
            DISPATCH UNITS
          </button>
          <button className="px-3 py-2 border border-cyber-orange text-cyber-orange font-orbitron text-xs rounded hover:shadow-glow-orange transition-all active:scale-95">
            ALERT BROADCAST
          </button>
          <button className="px-3 py-2 border border-cyber-green text-cyber-green font-orbitron text-xs rounded hover:shadow-glow-green transition-all active:scale-95">
            EVACUATE SECTOR
          </button>
          <button className="px-3 py-2 border border-cyber-cyan text-cyber-cyan font-orbitron text-xs rounded hover:shadow-glow-cyan transition-all active:scale-95">
            RESOURCE ALLOCATION
          </button>
          <button className="px-3 py-2 border border-cyber-orange text-cyber-orange font-orbitron text-xs rounded hover:shadow-glow-orange transition-all active:scale-95">
            INCIDENT REPORT
          </button>
        </div>
      </div>
    </div>
  );
};

export default CityMap;
