import { ethers } from "ethers";
import Voting from "./Voting.json";
console.log(Voting.abi);

const blockChainAddress = "0x16296C781bD77EF792a12D5037eC39d74D8C3EBf";
export const Connector = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  if (window.ethereum) {
    const signer = await provider.getSigner();
    const contractReader = new ethers.Contract(
      blockChainAddress,
      Voting.abi,
      signer
    );
    console.log(await contractReader);

    return contractReader;
  }
};
