import React, { useState, useEffect } from 'react';
import MapVisualizer from './components/MapVisualizer';
import FleetStatus from './components/FleetStatus';

function App() {
  const [mapData, setMapData] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchLiveMapData = () => {
      fetch('http://localhost:3001/api/map-data')
        .then(res => res.json())
        .then(data => {
          setMapData(data);
          setConnected(true);
        })
        .catch(err => {
          console.error("Error fetching map data:", err);
          setConnected(false);
        });
    };

    // 1. Fetch initially on load
    fetchLiveMapData();

    // 2. Poll the backend live every 2 seconds
    const interval = setInterval(fetchLiveMapData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-arcade-black crt font-retro text-arcade-green p-4 flex flex-col uppercase">
      {/* Retro Arcade Header */}
      <header className="border-4 border-arcade-green p-4 mb-4 text-center shadow-[0_0_15px_rgba(57,255,20,0.5)]">
        <h1 className="text-2xl md:text-4xl text-arcade-green animate-flicker tracking-widest">
          Swarm Map Sync
        </h1>
        <p className="mt-2 text-sm text-arcade-green opacity-80">
          Decentralized verification engine v1.0
        </p>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        {/* Left Panel: The Map Canvas */}
        <div className="flex-1 border-4 border-arcade-blue p-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] bg-grid flex flex-col relative">
          <div className="absolute top-2 left-2 text-arcade-blue text-xs z-10 bg-arcade-black px-1 opacity-80">
            [RADAR GRID]
          </div>
          <MapVisualizer points={mapData} />
        </div>

        {/* Right Panel: Telemetry Dashboard & Fleet Status */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <FleetStatus points={mapData} connected={connected} />
          
          {/* Decorative Terminal Output */}
          <div className="flex-1 border-4 border-arcade-red p-4 shadow-[0_0_15px_rgba(255,0,60,0.3)] bg-arcade-black overflow-y-auto font-mono text-sm leading-tight text-arcade-red">
            <h2 className="border-b-2 border-arcade-red pb-2 mb-2">System Log</h2>
            <div className="flex flex-col-reverse justify-start divide-y divide-arcade-red/30 gap-1 h-full">
              {[...mapData].reverse().slice(0, 10).map((pt, i) => (
                <div key={i} className="py-1">
                  &gt; RECV {pt.agentId} <br/>
                  [{pt.x}, {pt.y}]<br/>
                  <span className="text-xs opacity-50 truncate block">TX: {pt.transactionHash?.substring(0, 8)}...</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
