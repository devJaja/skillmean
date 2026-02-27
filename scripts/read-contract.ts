import { 
  callReadOnlyFunction,
  cvToJSON,
  uintCV,
  principalCV
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const network = process.env.NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
const contractAddress = process.env.CONTRACT_ADDRESS!;
const senderAddress = contractAddress;

async function getJob(jobId: number) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'escrow',
    functionName: 'get-job',
    functionArgs: [uintCV(jobId)],
    network,
    senderAddress,
  });

  return cvToJSON(result);
}

async function getEscrowBalance(jobId: number) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'escrow',
    functionName: 'get-escrow-balance',
    functionArgs: [uintCV(jobId)],
    network,
    senderAddress,
  });

  return cvToJSON(result);
}

async function getProfile(userAddress: string) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'reputation',
    functionName: 'get-profile',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress,
  });

  return cvToJSON(result);
}

async function getAverageRating(userAddress: string) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'reputation',
    functionName: 'get-average-rating',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress,
  });

  return cvToJSON(result);
}

async function getCompletionRate(userAddress: string) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'reputation',
    functionName: 'get-completion-rate',
    functionArgs: [principalCV(userAddress)],
    network,
    senderAddress,
  });

  return cvToJSON(result);
}

async function getDispute(jobId: number) {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName: 'dispute',
    functionName: 'get-dispute',
    functionArgs: [uintCV(jobId)],
    network,
    senderAddress,
  });

  return cvToJSON(result);
}

export { 
  getJob, 
  getEscrowBalance, 
  getProfile, 
  getAverageRating, 
  getCompletionRate,
  getDispute 
};
