import React, { useRef, useEffect } from 'react';

const MapVisualizer = ({ points }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grid settings
    const tileSize = 20; // Size of each "pixel" block in the map
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;

    // Draw origin (Base Station)
    ctx.fillStyle = '#fff'; // White for origin
    ctx.fillRect(offsetX - tileSize/2, offsetY - tileSize/2, tileSize, tileSize);

    // Group points by agent to find their timeline
    const agentPaths = {};
    points.forEach((point) => {
      if (!agentPaths[point.agentId]) {
        agentPaths[point.agentId] = [];
      }
      agentPaths[point.agentId].push(point);
    });

    // Configuration for the trail
    const TRAIL_LENGTH = 15; // Number of historic points to show per agent

    // Draw paths for each agent
    Object.keys(agentPaths).forEach(agentId => {
      // Get only the most recent points up to TRAIL_LENGTH
      const pathLength = agentPaths[agentId].length;
      const recentPath = agentPaths[agentId].slice(Math.max(0, pathLength - TRAIL_LENGTH));
      
      recentPath.forEach((point, index) => {
        // Scale and shift coordinates to fit the grid
        const px = offsetX + (point.x * (tileSize/5)); 
        const py = offsetY - (point.y * (tileSize/5)); // inverted Y for standard cartesian
        
        // The last point in the sliced array is the current position
        const isLatest = index === recentPath.length - 1;

        // Determine color by agent ID
        let r, g, b;
        if (point.agentId === 'agent-alpha') {
          r=0; g=240; b=255;
        } else if (point.agentId === 'agent-beta') {
          r=255; g=0; b=60;
        } else {
          r=57; g=255; b=20;
        }

        // Calculate opacity based on position in trail. 
        // Index 0 (oldest point shown) will have lowest opacity, rising to 1.0 for the current point.
        let opacity;
        if (isLatest) {
           opacity = 1.0;
        } else {
           // E.g., if TRAIL_LENGTH is 15 -> index ranges from 0 to 13.
           // Maps index 0 -> 0.1, index 13 -> 0.6
           const trailProgress = index / (recentPath.length - 1);
           opacity = 0.1 + (trailProgress * 0.5); 
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;

        // Draw quantized block "pixel"
        const size = isLatest ? tileSize + 4 : tileSize;
        ctx.fillRect(px - size/2, py - size/2, size, size);
        
        // Add a slight dark border to each block for chunkiness
        ctx.strokeStyle = `rgba(10, 10, 12, ${isLatest ? 1.0 : opacity})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(px - size/2, py - size/2, size, size);
      });
    });
  }, [points]);

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="max-w-full max-h-full object-contain mix-blend-screen"
      />
    </div>
  );
};

export default MapVisualizer;
