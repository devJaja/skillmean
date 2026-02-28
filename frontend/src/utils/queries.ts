import { callReadOnlyFunction, cvToJSON, uintCV, principalCV } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { CONTRACTS, CONTRACT_ADDRESS } from '../config/contracts';

const network = new StacksMainnet();

export async function getJob(jobId: number) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'escrow',
    functionName: 'get-job',
    functionArgs: [uintCV(jobId)],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });
  return cvToJSON(result);
}

export async function getProfile(address: string) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'reputation',
    functionName: 'get-profile',
    functionArgs: [principalCV(address)],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });
  return cvToJSON(result);
}

export async function getAverageRating(address: string) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'reputation',
    functionName: 'get-average-rating',
    functionArgs: [principalCV(address)],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });
  return cvToJSON(result);
}
