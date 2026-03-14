Here is the complete, comprehensive `Guidelines.md` file. It is formatted specifically as an instruction manual for an AI coding agent like Antigravity, ensuring it understands the exact architecture, data flow, and file requirements to generate a flawless implementation plan.

You can copy this entire block and feed it directly to your agent.

---

# `Guidelines.md`

## Project Overview

**Title:** Decentralized Map Verification in Swarm Robotics Using Distributed Ledgers
**Objective:** Build a Proof-of-Concept (PoC) demonstrating how multi-agent robotic swarms can securely map an environment without a central server. The system uses simulated robotic agents (Node.js scripts) that push local $(x, y, z)$ SLAM coordinates to a decentralized Web3 Smart Contract. A backend indexer listens for these blockchain events and caches them in a database. A frontend dashboard visualizes the expanding map in real-time.

## Tech Stack Requirements

* **Smart Contracts:** Solidity (v0.8.20+), Hardhat, Ethers.js (v6)
* **Backend (Indexer & API):** Node.js, Express.js, MongoDB (Mongoose)
* **Frontend (Dashboard):** React.js (Vite), Tailwind CSS, Recharts / HTML5 Canvas for 2D map rendering
* **Network:** Local Hardhat Network (for initial dev), Polygon Amoy / Arbitrum Sepolia Testnet (for staging)
* **Deployment Target:** Frontend configured to be hosted on the custom domain `kshimate.space`.

---

## Environment Variables & Manual User Inputs

**CRITICAL FOR AI:** Do not hardcode these values. Generate a `.env` template at the root of the project. The user will manually input the following parameters before execution:

* `MONGO_URI`: The MongoDB connection string (e.g., MongoDB Atlas).
* `RPC_URL`: The Web3 provider endpoint (e.g., Alchemy or Infura URL for the chosen testnet).
* `PRIVATE_KEY_DEPLOYER`: The wallet private key used to deploy the smart contract.
* `PRIVATE_KEY_AGENT_1`: The wallet private key simulating Robot Node 1.
* `PRIVATE_KEY_AGENT_2`: The wallet private key simulating Robot Node 2.
* `CONTRACT_ADDRESS`: The deployed address of `MapLedger.sol` (User will paste this after the deployment script runs).

---

## Directory Structure

The project must be built as a Monorepo with the following exact structure:

```text
swarm-map-dapp/
├── contracts/
│   └── MapLedger.sol
├── scripts/
│   ├── deploy.js
│   ├── agent1_mock.js
│   └── agent2_mock.js
├── backend/
│   ├── .env
│   ├── server.js
│   ├── models/
│   │   └── MapPoint.js
│   └── routes/
│       └── api.js
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── MapVisualizer.jsx
│   │   │   └── FleetStatus.jsx
│   │   └── utils/
│   │       └── web3Config.js
├── hardhat.config.js
└── package.json

```

---

## Detailed File Briefs & Implementation Requirements

### 1. The Blockchain Layer (`/contracts` & Root)

**`contracts/MapLedger.sol`**

* **Purpose:** The decentralized database of truth.
* **Requirements:**
* Define a `struct Point { string agentId; int256 x; int256 y; int256 z; uint256 timestamp; }`.
* Create a mapping or array to store all submitted points.
* Implement an `addMapPoint(string memory _agentId, int256 _x, int256 _y, int256 _z)` function.
* **Crucial:** Emit an event `NewPointAdded(string agentId, int256 x, int256 y, int256 z, uint256 timestamp)` inside the `addMapPoint` function.



**`hardhat.config.js`**

* **Purpose:** Configure network connections and compiler versions.
* **Requirements:** Must import `dotenv` and configure networks to read `RPC_URL` and `PRIVATE_KEY_DEPLOYER` from the environment.

### 2. The Agent Simulation (`/scripts`)

**`scripts/deploy.js`**

* **Purpose:** Standard Hardhat script to compile and deploy `MapLedger.sol` to the network. Must output the deployed contract address to the console.

**`scripts/agent1_mock.js` & `scripts/agent2_mock.js**`

* **Purpose:** Simulate the physical ESP32 robots navigating an environment.
* **Requirements:**
* Initialize Ethers.js utilizing `PRIVATE_KEY_AGENT_1` (and 2 respectively).
* Connect to the deployed `MapLedger` contract using the ABI.
* Contain a hardcoded array of dummy $(x, y, z)$ coordinates representing a generated path (e.g., mapping a square room).
* Use a `setInterval` loop to iterate through the array, calling the `addMapPoint` smart contract function every 5-10 seconds to simulate real-time exploration.



### 3. The Backend Indexer (`/backend`)

**`backend/server.js`**

* **Purpose:** The core Express server acting as the bridge between the blockchain and the frontend dashboard.
* **Requirements:**
* Connect to MongoDB using Mongoose.
* Initialize an Ethers.js WebSocket or Polling provider listening to the `CONTRACT_ADDRESS`.
* Set up a listener specifically for the `NewPointAdded` event emitted by the smart contract.
* When the event triggers, parse the blockchain data and save it directly to the MongoDB database.



**`backend/models/MapPoint.js`**

* **Purpose:** Mongoose schema defining the data structure.
* **Requirements:** Fields must include `agentId` (String), `x` (Number), `y` (Number), `z` (Number), `timestamp` (Date), and `transactionHash` (String).

**`backend/routes/api.js`**

* **Purpose:** RESTful endpoints for the frontend.
* **Requirements:** Create a `GET /api/map-data` endpoint that fetches all points from MongoDB, sorted by timestamp, and returns them as a JSON array.

### 4. The Frontend Dashboard (`/frontend`)

**`frontend/src/App.jsx`**

* **Purpose:** Main container for the React application.
* **Requirements:** Implement a clean, dark-mode dashboard UI suitable for a technical demonstration.

**`frontend/src/components/MapVisualizer.jsx`**

* **Purpose:** The core visualization tool.
* **Requirements:**
* Fetch data from the backend `GET /api/map-data` endpoint periodically (or via Socket.io if implemented).
* Render the $(x, y)$ coordinates on a 2D Cartesian plane (using HTML5 Canvas or a charting library like Recharts).
* Differentiate the points visually (e.g., color-code Agent 1's points blue and Agent 2's points red).



**`frontend/src/components/FleetStatus.jsx`**

* **Purpose:** Telemetry display.
* **Requirements:** Show the latest timestamp of data received, total points mapped, and the active status of each agent based on recent blockchain transactions.

---

## Execution Directives for Antigravity

1. Initialize the Node.js project and install all required Hardhat, Web3, and MERN stack dependencies.
2. Generate the directory structure and placeholder files.
3. Write the `MapLedger.sol` contract and provide the deployment script.
4. Construct the mock agent scripts to ensure blockchain data population is functional.
5. Develop the Express backend to listen for contract events and write to MongoDB.
6. Build the React frontend to fetch and visualize the data.
7. Pause and prompt the user to configure the `.env` file before executing test scripts.

---

Would you like me to write the raw dummy coordinate arrays (the exact $(x, y, z)$ data) that you can paste into the `agent_mock.js` files so the final map actually looks like a room being explored?Here is the complete, comprehensive `Guidelines.md` file. It is formatted specifically as an instruction manual for an AI coding agent like Antigravity, ensuring it understands the exact architecture, data flow, and file requirements to generate a flawless implementation plan.

You can copy this entire block and feed it directly to your agent.

---

# `Guidelines.md`

## Project Overview

**Title:** Decentralized Map Verification in Swarm Robotics Using Distributed Ledgers
**Objective:** Build a Proof-of-Concept (PoC) demonstrating how multi-agent robotic swarms can securely map an environment without a central server. The system uses simulated robotic agents (Node.js scripts) that push local $(x, y, z)$ SLAM coordinates to a decentralized Web3 Smart Contract. A backend indexer listens for these blockchain events and caches them in a database. A frontend dashboard visualizes the expanding map in real-time.

## Tech Stack Requirements

* **Smart Contracts:** Solidity (v0.8.20+), Hardhat, Ethers.js (v6)
* **Backend (Indexer & API):** Node.js, Express.js, MongoDB (Mongoose)
* **Frontend (Dashboard):** React.js (Vite), Tailwind CSS, Recharts / HTML5 Canvas for 2D map rendering
* **Network:** Local Hardhat Network (for initial dev), Polygon Amoy / Arbitrum Sepolia Testnet (for staging)
* **Deployment Target:** Frontend configured to be hosted on the custom domain `kshimate.space`.

---

## Environment Variables & Manual User Inputs

**CRITICAL FOR AI:** Do not hardcode these values. Generate a `.env` template at the root of the project. The user will manually input the following parameters before execution:

* `MONGO_URI`: The MongoDB connection string (e.g., MongoDB Atlas).
* `RPC_URL`: The Web3 provider endpoint (e.g., Alchemy or Infura URL for the chosen testnet).
* `PRIVATE_KEY_DEPLOYER`: The wallet private key used to deploy the smart contract.
* `PRIVATE_KEY_AGENT_1`: The wallet private key simulating Robot Node 1.
* `PRIVATE_KEY_AGENT_2`: The wallet private key simulating Robot Node 2.
* `CONTRACT_ADDRESS`: The deployed address of `MapLedger.sol` (User will paste this after the deployment script runs).

---

## Directory Structure

The project must be built as a Monorepo with the following exact structure:

```text
swarm-map-dapp/
├── contracts/
│   └── MapLedger.sol
├── scripts/
│   ├── deploy.js
│   ├── agent1_mock.js
│   └── agent2_mock.js
├── backend/
│   ├── .env
│   ├── server.js
│   ├── models/
│   │   └── MapPoint.js
│   └── routes/
│       └── api.js
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── MapVisualizer.jsx
│   │   │   └── FleetStatus.jsx
│   │   └── utils/
│   │       └── web3Config.js
├── hardhat.config.js
└── package.json

```

---

## Detailed File Briefs & Implementation Requirements

### 1. The Blockchain Layer (`/contracts` & Root)

**`contracts/MapLedger.sol`**

* **Purpose:** The decentralized database of truth.
* **Requirements:**
* Define a `struct Point { string agentId; int256 x; int256 y; int256 z; uint256 timestamp; }`.
* Create a mapping or array to store all submitted points.
* Implement an `addMapPoint(string memory _agentId, int256 _x, int256 _y, int256 _z)` function.
* **Crucial:** Emit an event `NewPointAdded(string agentId, int256 x, int256 y, int256 z, uint256 timestamp)` inside the `addMapPoint` function.



**`hardhat.config.js`**

* **Purpose:** Configure network connections and compiler versions.
* **Requirements:** Must import `dotenv` and configure networks to read `RPC_URL` and `PRIVATE_KEY_DEPLOYER` from the environment.

### 2. The Agent Simulation (`/scripts`)

**`scripts/deploy.js`**

* **Purpose:** Standard Hardhat script to compile and deploy `MapLedger.sol` to the network. Must output the deployed contract address to the console.

**`scripts/agent1_mock.js` & `scripts/agent2_mock.js**`

* **Purpose:** Simulate the physical ESP32 robots navigating an environment.
* **Requirements:**
* Initialize Ethers.js utilizing `PRIVATE_KEY_AGENT_1` (and 2 respectively).
* Connect to the deployed `MapLedger` contract using the ABI.
* Contain a hardcoded array of dummy $(x, y, z)$ coordinates representing a generated path (e.g., mapping a square room).
* Use a `setInterval` loop to iterate through the array, calling the `addMapPoint` smart contract function every 5-10 seconds to simulate real-time exploration.



### 3. The Backend Indexer (`/backend`)

**`backend/server.js`**

* **Purpose:** The core Express server acting as the bridge between the blockchain and the frontend dashboard.
* **Requirements:**
* Connect to MongoDB using Mongoose.
* Initialize an Ethers.js WebSocket or Polling provider listening to the `CONTRACT_ADDRESS`.
* Set up a listener specifically for the `NewPointAdded` event emitted by the smart contract.
* When the event triggers, parse the blockchain data and save it directly to the MongoDB database.



**`backend/models/MapPoint.js`**

* **Purpose:** Mongoose schema defining the data structure.
* **Requirements:** Fields must include `agentId` (String), `x` (Number), `y` (Number), `z` (Number), `timestamp` (Date), and `transactionHash` (String).

**`backend/routes/api.js`**

* **Purpose:** RESTful endpoints for the frontend.
* **Requirements:** Create a `GET /api/map-data` endpoint that fetches all points from MongoDB, sorted by timestamp, and returns them as a JSON array.

### 4. The Frontend Dashboard (`/frontend`)

**`frontend/src/App.jsx`**

* **Purpose:** Main container for the React application.
* **Requirements:** Implement a clean, dark-mode dashboard UI suitable for a technical demonstration.

**`frontend/src/components/MapVisualizer.jsx`**

* **Purpose:** The core visualization tool.
* **Requirements:**
* Fetch data from the backend `GET /api/map-data` endpoint periodically (or via Socket.io if implemented).
* Render the $(x, y)$ coordinates on a 2D Cartesian plane (using HTML5 Canvas or a charting library like Recharts).
* Differentiate the points visually (e.g., color-code Agent 1's points blue and Agent 2's points red).



**`frontend/src/components/FleetStatus.jsx`**

* **Purpose:** Telemetry display.
* **Requirements:** Show the latest timestamp of data received, total points mapped, and the active status of each agent based on recent blockchain transactions.

---

## Execution Directives for Antigravity

1. Initialize the Node.js project and install all required Hardhat, Web3, and MERN stack dependencies.
2. Generate the directory structure and placeholder files.
3. Write the `MapLedger.sol` contract and provide the deployment script.
4. Construct the mock agent scripts to ensure blockchain data population is functional.
5. Develop the Express backend to listen for contract events and write to MongoDB.
6. Build the React frontend to fetch and visualize the data.
7. Pause and prompt the user to configure the `.env` file before executing test scripts.






