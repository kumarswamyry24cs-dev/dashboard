import React, { useState } from 'react';
import BootSequence from './components/BootSequence';
import Wizard from './components/Wizard';
import Header from './components/Header';
import SystemStatus from './components/SystemStatus';
import CityMap from './components/CityMap';
import IncidentLog from './components/IncidentLog';
import './index.css';

export default function App() {
  const [showWizard, setShowWizard] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'systems', label: 'Systems', icon: '⚙️' },
    { id: 'map', label: 'City Map', icon: '🗺️' },
    { id: 'incidents', label: 'Incidents', icon: '📋' }
  ];

  // Show boot sequence first, then wizard
  if (showBoot) {
    return <BootSequence onComplete={() => {
      setShowBoot(false);
      setShowWizard(true);
    }} />;
  }

  if (showWizard) {
    return <Wizard />;
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-text">
      <Header />

      {/* Navigation Tabs */}
      <nav className="border-b border-cyber-cyan bg-cyber-card bg-opacity-50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-tech-mono text-sm font-bold tracking-widest border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyber-cyan text-cyber-cyan glow-text'
                  : 'border-transparent text-gray-400 hover:text-cyber-cyan'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-card border border-cyber-cyan rounded overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyber-cyan to-transparent opacity-10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-orbitron font-bold mb-2 glow-text">SYSTEM INITIALIZED</h2>
                <p className="text-cyber-text mb-4">Welcome to the Smart City Emergency Recovery System. All critical infrastructure is monitored and ready for rapid response.</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-cyber-green text-cyber-dark font-orbitron font-bold text-sm rounded hover:shadow-glow-green transition-all active:scale-95">
                    ACTIVATE ALERT
                  </button>
                  <button className="px-4 py-2 border-2 border-cyber-cyan text-cyber-cyan font-orbitron font-bold text-sm rounded hover:shadow-glow-cyan transition-all active:scale-95">
                    VIEW PROTOCOLS
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-cyber-card border border-cyber-cyan rounded hover:shadow-glow-cyan transition-all">
                <div className="text-xs text-gray-400 font-tech-mono mb-2">SYSTEM UPTIME</div>
                <div className="text-2xl font-tech-mono font-bold text-cyber-cyan">99.97%</div>
                <div className="text-xs text-gray-500 mt-2">↑ +0.3% this week</div>
              </div>
              <div className="p-4 bg-cyber-card border border-cyber-green rounded hover:shadow-glow-green transition-all">
                <div className="text-xs text-gray-400 font-tech-mono mb-2">RESPONSE TIME</div>
                <div className="text-2xl font-tech-mono font-bold text-cyber-green">4.2s AVG</div>
                <div className="text-xs text-gray-500 mt-2">↓ -0.8s vs baseline</div>
              </div>
              <div className="p-4 bg-cyber-card border border-cyber-orange rounded hover:shadow-glow-orange transition-all">
                <div className="text-xs text-gray-400 font-tech-mono mb-2">ACTIVE INCIDENTS</div>
                <div className="text-2xl font-tech-mono font-bold text-cyber-orange">3</div>
                <div className="text-xs text-gray-500 mt-2">2 critical, 1 warning</div>
              </div>
              <div className="p-4 bg-cyber-card border border-cyber-cyan rounded hover:shadow-glow-cyan transition-all">
                <div className="text-xs text-gray-400 font-tech-mono mb-2">NETWORK STATUS</div>
                <div className="text-2xl font-tech-mono font-bold text-cyber-cyan">NOMINAL</div>
                <div className="text-xs text-gray-500 mt-2">All systems online</div>
              </div>
            </div>

            {/* Overview Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemStatus />
              <CityMap />
            </div>

            <IncidentLog />
          </div>
        )}

        {/* Systems Tab */}
        {activeTab === 'systems' && (
          <div>
            <SystemStatus />
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div>
            <CityMap />
          </div>
        )}

        {/* Incidents Tab */}
        {activeTab === 'incidents' && (
          <div>
            <IncidentLog />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-cyan mt-12 py-4 bg-cyber-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400 font-tech-mono">
            <div>
              <p>SMART CITY EMERGENCY RECOVERY SYSTEM</p>
              <p>Version: 4.2.1 | Build: 2026.05.11</p>
            </div>
            <div>
              <p>Status: OPERATIONAL</p>
              <p>Last Sync: {new Date().toLocaleTimeString()}</p>
            </div>
            <div>
              <p>© 2026 Emergency Management Authority</p>
              <p>For emergencies, call 911</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
