import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the Metadata contract for Batch 22 Graduation NFT
 * 
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMetadata: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("\n🎓 Deploying Metadata contract for Graduation NFT...");
  console.log("Deployer address:", deployer);

  await deploy("Metadata", {
    from: deployer,
    // No constructor arguments needed
    args: [],
    log: true,
    autoMine: true,
  });

  const metadataContract = await hre.ethers.getContract("Metadata", deployer);
  console.log("✅ Metadata contract deployed at:", await metadataContract.getAddress());
  
  // Test the contract
  const name = await metadataContract.getName();
  const [r, g, b] = await metadataContract.getColor();
  
  console.log("\n📝 Metadata details:");
  console.log("   Name:", name);
  console.log("   Color: RGB(%d, %d, %d)", r, g, b);
  console.log("\n🚀 Ready to graduate! Next steps:");
  console.log("   1. Call setMetadataContract() on BatchGraduationNFT");
  console.log("   2. Call graduate() on BatchRegistry");
};

export default deployMetadata;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Metadata
deployMetadata.tags = ["Metadata"];
