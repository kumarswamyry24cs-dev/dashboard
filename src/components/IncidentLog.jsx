import React, { useState, useEffect } from 'react';
import { DataCard } from './UIComponents';

const IncidentLog = () => {
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      time: '23:47:15',
      type: 'POWER_OUTAGE',
      severity: 'critical',
      location: 'Sector 7-B, Central District',
      description: 'Complete power loss in residential zone affecting 8,400 residents',
      status: 'ACTIVE'
    },
    {
      id: 2,
      time: '23:42:08',
      type: 'INFRASTRUCTURE',
      severity: 'warning',
      location: 'Central Avenue, Downtown',
      description: 'Water main rupture detected. Service area: 3,200 residents',
      status: 'IN_PROGRESS'
    },
    {
      id: 3,
      time: '23:38:22',
      type: 'COMMUNICATIONS',
      severity: 'warning',
      location: 'Tower 047, Downtown Zone',
      description: 'Cell tower offline. Coverage redirected to adjacent cells',
      status: 'IN_PROGRESS'
    },
    {
      id: 4,
      time: '23:31:45',
      type: 'TRAFFIC',
      severity: 'warning',
      location: 'Route 5, North Corridor',
      description: 'Multi-vehicle collision cleared. Traffic normalized',
      status: 'RESOLVED'
    },
    {
      id: 5,
      time: '23:25:30',
      type: 'EMERGENCY',
      severity: 'info',
      location: 'Metro Station 12',
      description: 'Routine maintenance completed. All systems nominal',
      status: 'COMPLETE'
    }
  ]);

  const severityColors = {
    critical: { bg: 'bg-red-900 bg-opacity-20', border: 'border-red-500', text: 'text-red-400', indicator: 'bg-red-500' },
    warning: { bg: 'bg-cyber-orange bg-opacity-20', border: 'border-cyber-orange', text: 'text-cyber-orange', indicator: 'bg-cyber-orange' },
    info: { bg: 'bg-cyber-cyan bg-opacity-20', border: 'border-cyber-cyan', text: 'text-cyber-cyan', indicator: 'bg-cyber-cyan' }
  };

  const typeIcons = {
    POWER_OUTAGE: '⚡',
    INFRASTRUCTURE: '🔧',
    COMMUNICATIONS: '📡',
    TRAFFIC: '🚗',
    EMERGENCY: '🚨'
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DataCard title="Total Incidents" value="847" unit="today" />
        <DataCard title="Active Incidents" value="3" unit="" status="critical" />
        <DataCard title="In Progress" value="2" unit="" status="warning" />
        <DataCard title="Resolved" value="842" unit="today" />
      </div>

      {/* Incident Log */}
      <div className="p-4 bg-cyber-card border border-cyber-cyan rounded">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-sm glow-text">📋 INCIDENT LOG</h3>
          <div className="text-xs text-gray-400 font-tech-mono">Real-time monitoring</div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {incidents.map((incident, index) => {
            const severityConfig = severityColors[incident.severity];
            return (
              <div
                key={incident.id}
                className={`p-3 border-l-4 ${severityConfig.border} ${severityConfig.bg} rounded transition-all hover:shadow-lg cursor-pointer`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${severityConfig.indicator} ${incident.status === 'ACTIVE' ? 'animate-pulse' : ''}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{typeIcons[incident.type] || '📌'}</span>
                        <span className={`font-orbitron text-xs font-bold ${severityConfig.text} uppercase tracking-widest`}>
                          {incident.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-tech-mono text-gray-400 flex-shrink-0">{incident.time}</span>
                    </div>
                    <p className="text-xs text-cyber-text mb-1">{incident.location}</p>
                    <p className="text-xs text-gray-400 mb-2">{incident.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-1 text-xs font-tech-mono rounded border ${severityConfig.border} ${severityConfig.text}`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400 font-tech-mono">
          <p>Last update: {new Date().toLocaleTimeString()}</p>
          <p>Data stream: LIVE • Feed rate: 1000ms interval</p>
        </div>
      </div>

      {/* Timeline View */}
      <div className="p-4 bg-cyber-card border border-cyber-green rounded">
        <h3 className="font-orbitron text-sm mb-4 glow-text-green">⏱️ INCIDENT TIMELINE</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-cyber-green to-cyber-cyan"></div>

          <div className="space-y-4 ml-16">
            {incidents.slice(0, 3).map((incident, index) => (
              <div key={incident.id} className="relative">
                <div className="absolute -left-14 w-8 h-8 rounded-full border-2 border-cyber-green bg-cyber-dark flex items-center justify-center text-xs font-tech-mono">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="text-xs">
                  <p className="font-orbitron text-cyber-green mb-1">{incident.time}</p>
                  <p className="text-cyber-text">{incident.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentLog;
