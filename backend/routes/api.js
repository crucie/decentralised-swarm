import express from 'express';
import mongoose from 'mongoose';
import { getMapPointModel } from '../models/MapPoint.js';

const router = express.Router();

// Get all map points from all agent collections
router.get('/map-data', async (req, res) => {
    try {
        // Find all collections that start with "mappoints_"
        const collections = await mongoose.connection.db.listCollections().toArray();
        const agentCollections = collections.filter(c => c.name.startsWith('mappoints_'));

        let allPoints = [];

        // Fetch points from each specific agent collection
        for (const col of agentCollections) {
            // Derive the agentId back from the collection name and use the factory
            const agentId = col.name.replace('mappoints_', '');
            const Model = getMapPointModel(agentId);
            const points = await Model.find().lean();
            allPoints = allPoints.concat(points);
        }

        // Sort combined points chronologically
        allPoints.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        res.json(allPoints);
    } catch (err) {
        console.error('Error fetching map data:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Optional: Get points for a specific agent
router.get('/map-data/:agentId', async (req, res) => {
    try {
        const Model = getMapPointModel(req.params.agentId);
        const points = await Model.find().sort({ timestamp: 1 }).lean();
        res.json(points);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
