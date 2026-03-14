# Decentralised Swarm Robotics - Verification Engine

A decentralized proof-of-completion system where simulated swarm agents independently log their traversal paths to an Ethereum blockchain for absolute, tamper-proof verification of space explored. 

![alt text](<Screenshot 2026-03-14 at 14-44-48 frontend - Copy.png>)

![Project Hero Image]

---

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [How the System Operates](#how-the-system-operates)
3. [Smart Contract Architecture](#smart-contract-architecture)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Visualizations](#visualizations)
7. [License](#license)

---

## 🎯 Project Overview
In swarm robotics, individual agents (drones, rovers, etc.) explore environments asynchronously. Verifying that a specific agent actually explored a specific coordinate at a specific time is a challenging distributed systems problem. 

This verification engine solves this by giving each agent a dedicated EVM wallet. As agents traverse a physical or simulated space, they act as active oracle nodes—signing transactions and committing their spatial coordinates `(X, Y, Z)` directly onto an immutable blockchain ledger. 

This creates a **trustless audit trail** of exploration.

## ⚙️ How the System Operates
This project operates as a full-stack Web3 application with a reactive backend and retro-themed frontend visualization. 

1. **Agent Simulation (Mock Scripts):** 
   Two simulated agents (`agent1_mock.js` and `agent2_mock.js`) generate spatial coordinates via a random walk algorithm. Every few seconds, they sign these coordinates using their private keys and send a transaction to the local Hardhat blockchain.
2. **Blockchain Ledger (`MapLedger.sol`):** 
   The Ethereum smart contract receives the transaction, verifies the signature matching the agent's ID, and permanently logs the `(X, Y, Z)` coordinate alongside a block timestamp.
3. **Backend Indexer & API (`backend/server.js`):** 
   An Express backend utilizes `ethers.js` to continuously listen to the blockchain for new block events. When an agent logs a point, the backend immediately extracts that event, quantizes it into a discrete "Grid ID", saves it to MongoDB, and pushes the live data to the frontend via Server-Sent Events / Polling.
4. **Retro Radar Frontend (`React + Vite + Tailwind CSS v4`):**
   A React visualization dashboard plots the absolute position of the agents in real-time. Historic trails are drawn with fading opacity, whilst current real-time agent locations are highlighted in stark arcade colors (`Arcade Blue` for Alpha, `Arcade Red` for Beta).

![Architecture Diagram]


## 📜 Smart Contract Architecture
The core logic resides in `MapLedger.sol`. 

- **Primary Structure**: Each map point is defined as a struct containing spatial coordinates (`X, Y, Z`), a `timestamp`, an `agentId`, and the `wallet address` that submitted it.
- **Role Control**: The contract defines permissioned roles. Only specifically whitelisted wallet addresses (the agents) are allowed to call the `addMapPoint` function, preventing spoofed data injection from unauthorized nodes.
- **Events**: The contract emits a `NewPointAdded` event for every successful coordinate logged. This allows our backend indexer to easily scan and synchronize the decentralized state without executing expensive, constant polling calls against the EVM.

---

## 🛠 Prerequisites
Before running this project, ensure you have the following installed on your machine:
- **Node.js**: (v18.0.0 or higher recommended)
- **MongoDB**: (Local instance running on `localhost:27017` or a Mongo Atlas URI)
- **Git**

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd decentralised-swarm
```

### 2. Install Dependencies
Install the required packages for both the backend and frontend.
```bash
# Install root dependencies (Hardhat, Ethers, etc.)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the root directory (you can use the `.env.template` as a starting point). Provide your local MongoDB URI and the default Hardhat deterministic private keys.

```env
MONGO_URI="mongodb://localhost:27017/swarm-map"
RPC_URL="http://127.0.0.1:8545"
PRIVATE_KEY_DEPLOYER="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
PRIVATE_KEY_AGENT_1="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
PRIVATE_KEY_AGENT_2="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
# CONTRACT_ADDRESS will be populated after deployment
```

### 4. Boot Up the Hardhat Blockchain
In your first terminal, start the local EVM network. Keep this running.
```bash
npx hardhat node
```

### 5. Deploy the Smart Contract
In a second terminal, compile and deploy the `MapLedger` contract.
```bash
npx hardhat run scripts/deploy.js --network localhost
```
*Note: Copy the `Deployed Contract Address` output from the terminal and add it to your `.env` file as `CONTRACT_ADDRESS="0x..."`.*

### 6. Start the Backend API & Indexer
In a new terminal window:
```bash
node backend/server.js
```

### 7. Run the Swarm Agents
Open two new terminal windows to simulate the agents exploring the map:

**Terminal A (Agent Alpha):**
```bash
node scripts/agent1_mock.js
```

**Terminal B (Agent Beta):**
```bash
node scripts/agent2_mock.js
```

### 8. Start the Retro Web Dashboard
Finally, start your frontend app to watch the swarm live!
```bash
cd frontend
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📸 Visualizations

### Live Radar Tracking
![Radar Map UI](<Placeholder for a screenshot showing the trailing agents on the React Grid>)
*A look at the retro-arcade dashboard updating live as the Mongoose models continuously index Hardhat events.*

### Terminal Outputs
![Terminal Outputs](<Placeholder for a screenshot showing the mock agents successfully hashing blocks>)
*The local EVM processing the agent multi-sig coordinates.*

---

## 🤝 License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
