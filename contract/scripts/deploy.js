const hre = require("hardhat");

async function main() {
  // نقوم بإستدعاء العقد الذكي من اجل نشره
  const YouTube = await hre.ethers.getContractFactory("YouTube");
  const youtube = await YouTube.deploy();

  await youtube.deployed();

  console.log("YouTube deployed to:", youtube.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
