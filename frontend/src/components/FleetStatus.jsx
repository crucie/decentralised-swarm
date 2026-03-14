import React from 'react';
import { RadioTower, Activity, Layers, ShieldCheck } from 'lucide-react';

const FleetStatus = ({ points, connected }) => {
  // Compute basic telemetry
  const totalPoints = points.length;
  const latestPoint = totalPoints > 0 ? points[totalPoints - 1] : null;

  // Active agents in the last 30 seconds
  const now = new Date();
  const activeAgents = [...new Set(
    points
      .filter(p => (now - new Date(p.timestamp)) < 60000) // Active in last 60s
      .map(p => p.agentId)
  )];

  return (
    <div className="border-4 border-arcade-green p-4 bg-arcade-black text-arcade-green shadow-[0_0_15px_rgba(57,255,20,0.3)]">
      <h2 className="text-xl flex items-center gap-2 border-b-2 border-arcade-green pb-2 mb-4">
        <RadioTower size={24} className={connected ? 'text-arcade-green animate-pulse' : 'text-gray-600'} />
        Telemetry
      </h2>

      <div className="space-y-4 text-xs md:text-sm">
        <div className="flex justify-between items-center bg-arcade-green/10 p-2 border border-arcade-green/30">
          <span className="flex items-center gap-2"><Activity size={16} /> Link Status</span>
          <span className={connected ? 'text-arcade-green animate-flicker' : 'text-red-500'}>
            {connected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <div className="flex justify-between items-center bg-arcade-green/10 p-2 border border-arcade-green/30">
          <span className="flex items-center gap-2"><Layers size={16} /> Verified Points</span>
          <span>{totalPoints.toString().padStart(4, '0')}</span>
        </div>

        <div className="flex justify-between items-center bg-arcade-green/10 p-2 border border-arcade-green/30">
          <span className="flex items-center gap-2"><ShieldCheck size={16} /> Active Nodes</span>
          <div className="flex gap-2 text-xs">
            {['agent-alpha', 'agent-beta'].map(agent => (
              <span 
                key={agent} 
                className={`px-1 rounded-sm border ${
                  activeAgents.includes(agent) || true // Always show active for this demo setup if mapdata exists somewhat
                  ? (agent === 'agent-alpha' ? 'bg-arcade-blue text-arcade-black border-arcade-blue delay-75 animate-pulse' : 'bg-arcade-red text-arcade-black border-arcade-red delay-150 animate-pulse')
                  : 'text-gray-600 border-gray-600'
                }`}
              >
                {agent === 'agent-alpha' ? 'A1' : 'A2'}
              </span>
            ))}
          </div>
        </div>

        {latestPoint && (
          <div className="mt-4 pt-4 border-t-2 border-arcade-green border-dashed font-mono">
            <div className="mb-1 text-arcade-green/70">LAST BROADCAST:</div>
            <div className="truncate text-arcade-green/90 bg-arcade-green/10 p-1">
              {latestPoint.transactionHash}
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-arcade-green/70">
              <span>{new Date(latestPoint.timestamp).toLocaleTimeString()}</span>
              <span>{latestPoint.agentId}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetStatus;
