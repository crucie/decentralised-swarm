import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMapPointModel } from './backend/models/MapPoint.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the project root
dotenv.config({ path: path.resolve(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

async function exportData() {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // We need to fetch from all specific agent collections.
    // In mongoose we can look at the connection to find all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const mapPointCollections = collections.filter(c => c.name.startsWith('mappoints_'));

    console.log(`Found ${mapPointCollections.length} agent collections.`);

    let allPoints = [];

    for (const collection of mapPointCollections) {
      // Extract agent name from collection name to pass to getMapPointModel
      const agentId = collection.name.replace('mappoints_', '');
      const Model = getMapPointModel(agentId);
      
      const points = await Model.find({}, {
        _id: 0,
        __v: 0
      }).lean();

      allPoints = allPoints.concat(points);
    }

    // Sort all points by timestamp to keep them chronological
    allPoints.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    console.log(`Extracted a total of ${allPoints.length} points.`);

    const outputDir = path.join(__dirname, 'frontend', 'public');
    const outputPath = path.join(outputDir, 'mockMapData.json');

    // Ensure the directory exists (it should, but just in case)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(allPoints, null, 2));
    console.log(`\n✅ Successfully exported data to: ${outputPath}`);
    console.log(`You can now deploy this to Vercel with VITE_USE_STATIC_DATA=true\n`);

  } catch (err) {
    console.error('Error exporting data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

exportData();
