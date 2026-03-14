import { ethers } from "ethers";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying MapLedger...");

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
  const privateKey = process.env.PRIVATE_KEY_DEPLOYER;
  if (!privateKey) throw new Error("Missing PRIVATE_KEY_DEPLOYER in .env");
  
  const wallet = new ethers.Wallet(privateKey, provider);

  // Read compiled artifact from Hardhat
  const artifactPath = path.resolve(__dirname, "..", "artifacts", "contracts", "MapLedger.sol", "MapLedger.json");
  const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const mapLedger = await factory.deploy();
  await mapLedger.waitForDeployment();

  const address = await mapLedger.getAddress();
  console.log(`MapLedger deployed to: ${address}`);
  console.log(`Please copy this address and place it in the CONTRACT_ADDRESS variable of your .env file.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
