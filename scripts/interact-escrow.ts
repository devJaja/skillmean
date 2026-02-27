import { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode,
  uintCV,
  stringAsciiCV,
  PostConditionMode
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const network = process.env.NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
const contractAddress = process.env.CONTRACT_ADDRESS!;

async function postJob(
  title: string, 
  amount: number, 
  deadline: number, 
  senderKey: string
) {
  const txOptions = {
    contractAddress,
    contractName: 'escrow',
    functionName: 'post-job',
    functionArgs: [
      stringAsciiCV(title),
      uintCV(amount),
      uintCV(deadline)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  
  console.log(`✅ Job posted: ${result.txid}`);
  return result.txid;
}

async function acceptJob(jobId: number, senderKey: string) {
  const txOptions = {
    contractAddress,
    contractName: 'escrow',
    functionName: 'accept-job',
    functionArgs: [uintCV(jobId)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  
  console.log(`✅ Job accepted: ${result.txid}`);
  return result.txid;
}

async function submitWork(jobId: number, senderKey: string) {
  const txOptions = {
    contractAddress,
    contractName: 'escrow',
    functionName: 'submit-work',
    functionArgs: [uintCV(jobId)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  
  console.log(`✅ Work submitted: ${result.txid}`);
  return result.txid;
}

async function approveWork(jobId: number, senderKey: string) {
  const txOptions = {
    contractAddress,
    contractName: 'escrow',
    functionName: 'approve-work',
    functionArgs: [uintCV(jobId)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  
  console.log(`✅ Work approved & payment released: ${result.txid}`);
  return result.txid;
}

export { postJob, acceptJob, submitWork, approveWork };
