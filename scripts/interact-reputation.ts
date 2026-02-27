import { 
  makeContractCall, 
  broadcastTransaction, 
  AnchorMode,
  uintCV,
  stringAsciiCV,
  principalCV,
  PostConditionMode
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const network = process.env.NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
const contractAddress = process.env.CONTRACT_ADDRESS!;

async function createProfile(
  username: string,
  bio: string,
  skills: string,
  senderKey: string
) {
  const txOptions = {
    contractAddress,
    contractName: 'reputation',
    functionName: 'create-profile',
    functionArgs: [
      stringAsciiCV(username),
      stringAsciiCV(bio),
      stringAsciiCV(skills)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  
  console.log(`✅ Profile created: ${result.txid}`);
  return result.txid;
}

async function updateProfile(
  bio: string,
  skills: string,
  senderKey: string
) {
  const txOptions = {
    contractAddress,
    contractName: 'reputation',
    functionName: 'update-profile',
    functionArgs: [
      stringAsciiCV(bio),
      stringAsciiCV(skills)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  
  console.log(`✅ Profile updated: ${result.txid}`);
  return result.txid;
}

async function submitRating(
  jobId: number,
  professional: string,
  rating: number,
  comment: string,
  senderKey: string
) {
  const txOptions = {
    contractAddress,
    contractName: 'reputation',
    functionName: 'submit-rating',
    functionArgs: [
      uintCV(jobId),
      principalCV(professional),
      uintCV(rating),
      stringAsciiCV(comment)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 10000,
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  
  console.log(`✅ Rating submitted: ${result.txid}`);
  return result.txid;
}

export { createProfile, updateProfile, submitRating };
