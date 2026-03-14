import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load .env from the project root (one level up from /backend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { ethers } from 'ethers';
import { getMapPointModel } from './models/MapPoint.js';
import mapRoutes from './routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', mapRoutes);

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swarm-map';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// SSE Clients
let sseClients = [];

app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Send initial connection success message
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
    
    sseClients.push(res);
    console.log('SSE Client connected');

    req.on('close', () => {
        sseClients = sseClients.filter(client => client !== res);
        console.log('SSE Client disconnected');
    });
});

const broadcastToClients = (data) => {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    sseClients.forEach(client => client.write(message));
};

// Web3 Listener setup
const setupWeb3Listener = async () => {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
        
        // Use ABI snippet since we only care about the event
        const abi = [
            "event NewPointAdded(string agentId, int256 x, int256 y, int256 z, uint256 timestamp)"
        ];
        
        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            console.log("CONTRACT_ADDRESS not set. Waiting for deploy...");
            return;
        }

        const contract = new ethers.Contract(contractAddress, abi, provider);
        console.log(`Listening to MapLedger at ${contractAddress}`);

        contract.on("NewPointAdded", async (agentId, x, y, z, timestamp, event) => {
            console.log(`Blockchain Event: Agent ${agentId} at (${x}, ${y}, ${z})`);
            
            // Quantize the true position into a generic 16x16 or 32x32 retro grid tile
            const gridTileX = Math.floor(Number(x) / 10);
            const gridTileY = Math.floor(Number(y) / 10);
            const gridTileId = `${gridTileX},${gridTileY}`;

            try {
                // Get the specific model for this agent
                const MapPointDynamic = getMapPointModel(agentId);

                const newPoint = new MapPointDynamic({
                    agentId: agentId,
                    x: Number(x),
                    y: Number(y),
                    z: Number(z),
                    timestamp: new Date(Number(timestamp) * 1000),
                    transactionHash: event.log.transactionHash,
                    gridTileId: gridTileId
                });

                await newPoint.save();
                
                // Broadcast to live dashboard via SSE
                broadcastToClients({ type: 'new_point', data: newPoint });
            } catch (err) {
                console.error("Error saving indexed point to MongoDB:", err);
            }
        });
    } catch (err) {
        console.error("Web3 Error:", err);
    }
}

app.listen(PORT, () => {
    console.log(`Indexer and API running on port ${PORT}`);
    setupWeb3Listener();
});
