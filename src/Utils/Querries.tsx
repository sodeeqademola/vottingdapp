import { Connector } from "./Connector";

export const setCandidates = async (
  address: string,
  age: string,
  image: string,
  name: string,
  ipfs: string
) => {
  const contractObj = (await Connector()) as any;
  const transactionResponse = await contractObj.setCandidate(
    address,
    age,
    image,
    name,
    ipfs
  );
  const receipt = await transactionResponse.wait();
  console.log(receipt);
  return receipt;
};
