import { openContractCall } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { uintCV, stringAsciiCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACTS } from '../config/contracts';

const network = new StacksMainnet();

export async function postJob(title: string, amount: number, deadline: number) {
  return openContractCall({
    network,
    contractAddress: CONTRACTS.ESCROW.split('.')[0],
    contractName: 'escrow',
    functionName: 'post-job',
    functionArgs: [stringAsciiCV(title), uintCV(amount), uintCV(deadline)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => data,
  });
}

export async function acceptJob(jobId: number) {
  return openContractCall({
    network,
    contractAddress: CONTRACTS.ESCROW.split('.')[0],
    contractName: 'escrow',
    functionName: 'accept-job',
    functionArgs: [uintCV(jobId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => data,
  });
}

export async function submitWork(jobId: number) {
  return openContractCall({
    network,
    contractAddress: CONTRACTS.ESCROW.split('.')[0],
    contractName: 'escrow',
    functionName: 'submit-work',
    functionArgs: [uintCV(jobId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => data,
  });
}

export async function approveWork(jobId: number) {
  return openContractCall({
    network,
    contractAddress: CONTRACTS.ESCROW.split('.')[0],
    contractName: 'escrow',
    functionName: 'approve-work',
    functionArgs: [uintCV(jobId)],
    postConditionMode: PostConditionMode.Allow,
    onFinish: (data) => data,
  });
}
