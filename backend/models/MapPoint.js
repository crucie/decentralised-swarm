import mongoose from 'mongoose';

const mapPointSchema = new mongoose.Schema({
  agentId: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  z: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  transactionHash: { type: String, required: true },
  gridTileId: { type: String, required: true } // Quantized tile for the 16-bit frontend
});

// A factory function to get or create a model for a specific agent
export const getMapPointModel = (agentId) => {
  // Use a unique collection name per agent, eg "mappoints_agent-alpha"
  const collectionName = `mappoints_${agentId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  
  // Return the existing model if compiled, otherwise compile a new one
  return mongoose.models[collectionName] 
    || mongoose.model(collectionName, mapPointSchema, collectionName);
};
