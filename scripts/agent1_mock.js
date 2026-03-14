import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
    const privateKey = process.env.PRIVATE_KEY_AGENT_1;
    if (!privateKey) throw new Error("Missing PRIVATE_KEY_AGENT_1");
    
    const wallet = new ethers.Wallet(privateKey, provider);
    
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) throw new Error("Missing CONTRACT_ADDRESS");

    // Minimal ABI
    const abi = ["function addMapPoint(string _agentId, int256 _x, int256 _y, int256 _z) public"];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log(`🤖 Agent 1 (Blue) Activated`);
    const agentId = "agent-alpha";

    let currentPosition = { x: 10, y: 10, z: 0 };
    
    setInterval(async () => {
        // Random walk step
        const direction = Math.floor(Math.random() * 4);
        const stepSize = 5; // move by 5 units
        
        switch(direction) {
            case 0: currentPosition.x += stepSize; break; // Right
            case 1: currentPosition.x -= stepSize; break; // Left
            case 2: currentPosition.y += stepSize; break; // Up
            case 3: currentPosition.y -= stepSize; break; // Down
        }

        const point = currentPosition;
        try {
            console.log(`Agent 1: Scanning... found coordinate (${point.x}, ${point.y}, ${point.z})`);
            const tx = await contract.addMapPoint(agentId, point.x, point.y, point.z);
            console.log(`==> Local chain tx sent: ${tx.hash}`);
            await tx.wait();
            console.log(`==> Block mined for point!`);
        } catch (error) {
        }
    }, 7000); // 7 sec delay
}

main();
