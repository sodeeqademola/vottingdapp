import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import fs from "fs";

const account1 = fs.readFileSync("./src/Secret.txt").toString();
// console.log(account1);

//blockChainDeployedAddress =  0x16296C781bD77EF792a12D5037eC39d74D8C3EBf

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    bitTorrent: {
      chainId: 1029,
      url: "https://pre-rpc.bt.io/",
      accounts: [account1],
      gasPrice: 1000000000,
    },
  },
};

// 06262ddb6137a5410b91e09b4be79f1e4f4b162efa36060b4f8c88d4586679fc
export default config;
