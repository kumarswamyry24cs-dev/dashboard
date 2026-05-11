import React from 'react';

export const GaugeChart = ({ label, value, max = 100, accentColor = 'cyan', warning = 80 }) => {
  const percentage = (value / max) * 100;
  const isWarning = percentage >= warning;
  const colors = {
    cyan: { bar: 'from-cyber-cyan to-cyber-green', text: 'text-cyber-cyan' },
    orange: { bar: 'from-cyber-orange to-red-500', text: 'text-cyber-orange' },
    green: { bar: 'from-cyber-green to-emerald-400', text: 'text-cyber-green' }
  };

  const currentColor = isWarning ? 'orange' : colors[accentColor] ? accentColor : 'cyan';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-tech-mono tracking-widest text-cyber-text">{label}</span>
        <span className={`text-sm font-tech-mono font-bold ${colors[currentColor].text}`}>
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="w-full h-2 bg-cyber-card border border-cyber-cyan rounded overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[currentColor].bar} transition-all duration-300 ${isWarning ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 font-tech-mono">{percentage.toFixed(1)}%</div>
    </div>
  );
};

export const StatusBadge = ({ status, label }) => {
  const statusConfig = {
    active: { bg: 'bg-cyber-green', text: 'text-cyber-green', pulse: true },
    warning: { bg: 'bg-cyber-orange', text: 'text-cyber-orange', pulse: true },
    critical: { bg: 'bg-red-500', text: 'text-red-500', pulse: true },
    offline: { bg: 'bg-gray-600', text: 'text-gray-400', pulse: false }
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded border ${config.text} border-current ${config.pulse ? 'animate-pulse' : ''}`}>
      <div className={`w-2 h-2 rounded-full ${config.bg}`}></div>
      <span className="text-xs font-tech-mono tracking-widest">{label}</span>
    </div>
  );
};

export const DataCard = ({ title, value, unit = '', icon = null, status = 'normal' }) => {
  const statusColor = status === 'warning' ? 'text-cyber-orange' : status === 'critical' ? 'text-red-500' : 'text-cyber-cyan';

  return (
    <div className="p-3 bg-cyber-card border border-cyber-cyan rounded hover:shadow-glow-cyan transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-tech-mono tracking-widest text-gray-400">{title}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className={`text-2xl font-tech-mono font-bold ${statusColor}`}>
        {value}<span className="text-sm ml-1">{unit}</span>
      </div>
    </div>
  );
};

export const Alert = ({ severity = 'info', title, message, icon = '⚠️' }) => {
  const severityConfig = {
    info: { border: 'border-cyber-cyan', bg: 'bg-cyber-card', text: 'text-cyber-cyan' },
    warning: { border: 'border-cyber-orange', bg: 'bg-cyan-900 bg-opacity-20', text: 'text-cyber-orange' },
    critical: { border: 'border-red-500', bg: 'bg-red-900 bg-opacity-20', text: 'text-red-400' },
    success: { border: 'border-cyber-green', bg: 'bg-green-900 bg-opacity-20', text: 'text-cyber-green' }
  };

  const config = severityConfig[severity] || severityConfig.info;

  return (
    <div className={`p-4 border-l-4 ${config.border} ${config.bg} rounded mb-4 flex gap-3 items-start`}>
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <h4 className={`font-orbitron text-sm font-bold ${config.text} mb-1`}>{title}</h4>
        <p className="text-xs text-cyber-text leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export const MapGrid = ({ data = [] }) => {
  return (
    <div className="grid grid-cols-4 gap-1 p-2 bg-cyber-card border border-cyber-cyan rounded">
      {[...Array(16)].map((_, idx) => {
        const sector = data[idx] || { status: 'normal', value: Math.floor(Math.random() * 100) };
        const statusColor = sector.status === 'critical' ? 'bg-red-500' : sector.status === 'warning' ? 'bg-cyber-orange' : 'bg-cyber-green';

        return (
          <div
            key={idx}
            className={`aspect-square rounded border border-cyber-cyan flex items-center justify-center text-xs font-tech-mono cursor-pointer hover:shadow-glow-cyan transition-all ${statusColor} ${statusColor === 'bg-cyber-green' ? 'opacity-40' : 'opacity-100'}`}
          >
            <span className="text-white text-opacity-70">{sector.value}</span>
          </div>
        );
      })}
    </div>
  );
};
