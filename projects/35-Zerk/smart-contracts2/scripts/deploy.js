const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying LawyerContract with the account:", deployer.address);

  //-----Deploy & Verify Lawyer-----//
  const LawyerContract = await hre.ethers.deployContract("ZerkLawyerJuster");

  const ZerkLawyer = await LawyerContract.waitForDeployment();

  console.log("ZerkLawyer deployed to:", ZerkLawyer.target);

  await new Promise((resolve) => setTimeout(resolve, 30000));

  run("verify:verify", {
    address: ZerkLawyer.target,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
