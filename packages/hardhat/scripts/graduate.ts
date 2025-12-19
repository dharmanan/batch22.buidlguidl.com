import * as dotenv from "dotenv";
dotenv.config();
import { ethers, Wallet } from "ethers";
import password from "@inquirer/password";

/**
 * Script to complete Batch 22 Graduation NFT process
 * 
 * Steps:
 * 1. Set metadata contract on BatchGraduationNFT
 * 2. Graduate by calling BatchRegistry.graduate()
 */

// Contract addresses on Arbitrum Mainnet
const BATCH_GRADUATION_NFT_ADDRESS = "0x01ee760bA941Da2f0b0bA8F3Dd59c745Ce8862ef";
const BATCH_REGISTRY_ADDRESS = "0xBa7A0079ce923ed5D5F502D4E938bac1df148f24";
const METADATA_CONTRACT_ADDRESS = "0xCE20C75622f0a0E9aE8EfcB03D19634243abC80A"; // Your deployed contract
const ARBITRUM_RPC = "https://arb-mainnet.g.alchemy.com/v2/cR4WnXePioePZ5fFrnSiR";

async function main() {
  console.log("🎓 Starting Batch 22 Graduation Process...\n");

  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;
  if (!encryptedKey) {
    console.log("🚫️ No deployer account found");
    return;
  }

  const pass = await password({ message: "Enter password to decrypt private key:" });
  const wallet = await Wallet.fromEncryptedJson(encryptedKey, pass);
  
  const provider = new ethers.JsonRpcProvider(ARBITRUM_RPC);
  const signer = wallet.connect(provider);
  
  console.log("Signer address:", await signer.getAddress());
  
  const balance = await provider.getBalance(await signer.getAddress());
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  // Step 1: Set Metadata Contract
  console.log("\n📝 Step 1: Setting metadata contract...");
  
  const batchGraduationNFTAbi = [
    "function setMetadataContract(address metadataContract) external",
    "function yourGraduationContractAddress(address) external view returns (address)"
  ];
  
  const batchGraduationNFT = new ethers.Contract(
    BATCH_GRADUATION_NFT_ADDRESS,
    batchGraduationNFTAbi,
    signer
  );

  try {
    const setMetadataTx = await batchGraduationNFT.setMetadataContract(METADATA_CONTRACT_ADDRESS);
    console.log("Transaction sent:", setMetadataTx.hash);
    console.log("Waiting for confirmation...");
    await setMetadataTx.wait();
    console.log("✅ Metadata contract set successfully!");
  } catch (error: any) {
    if (error.message.includes("already set")) {
      console.log("ℹ️ Metadata contract already set, continuing...");
    } else {
      throw error;
    }
  }

  // Step 2: Graduate!
  console.log("\n🎉 Step 2: Calling graduate()...");
  console.log("⚠️ WARNING: This can only be done ONCE on mainnet!");
  
  const batchRegistryAbi = [
    "function graduate() external",
    "function graduatedTokenId(address) external view returns (uint256)"
  ];
  
  const batchRegistry = new ethers.Contract(
    BATCH_REGISTRY_ADDRESS,
    batchRegistryAbi,
    signer
  );

  const graduateTx = await batchRegistry.graduate();
  console.log("Transaction sent:", graduateTx.hash);
  console.log("Waiting for confirmation...");
  const receipt = await graduateTx.wait();
  console.log("✅ GRADUATED! 🎓🎉");
  
  // Get token ID from events
  const tokenId = await batchRegistry.graduatedTokenId(await signer.getAddress());
  console.log("\n🏆 Your Graduation NFT Token ID:", tokenId.toString());
  console.log("\n🔗 View on Arbiscan:");
  console.log(`   https://arbiscan.io/tx/${receipt?.hash}`);
  console.log("\n🖼️ View on OpenSea:");
  console.log(`   https://opensea.io/assets/arbitrum/${BATCH_GRADUATION_NFT_ADDRESS}/${tokenId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
