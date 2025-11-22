const hre = require('hardhat');
require('dotenv').config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with', deployer.address);

  const ZShift = await hre.ethers.getContractFactory('ZShiftOFT');
  const initialLzEndpoint = process.env.LZ_ENDPOINT || hre.ethers.constants.AddressZero;
  const name = process.env.TOKEN_NAME || 'ZShift';
  const symbol = process.env.TOKEN_SYMBOL || 'ZSFT';

  const z = await ZShift.deploy(initialLzEndpoint, name, symbol);
  await z.deployed();
  console.log('ZShift deployed:', z.address);
}

main().catch((e) => { console.error(e); process.exit(1); });
