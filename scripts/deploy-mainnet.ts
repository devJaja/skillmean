import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import * as fs from 'fs';

const network = new StacksMainnet();

async function deployContract(contractName: string, contractPath: string, senderKey: string) {
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  
  const txOptions = {
    contractName,
    codeBody,
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    fee: 50000, // 0.05 STX per contract
  };

  const transaction = await makeContractDeploy(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  console.log(`✅ ${contractName} deployed: ${broadcastResponse.txid}`);
  return broadcastResponse.txid;
}

async function main() {
  const privateKey = process.env.STACKS_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('STACKS_PRIVATE_KEY environment variable required');
  }

  console.log('🚀 Deploying Skills-Bridge to Stacks Mainnet...\n');

  await deployContract('escrow', './contracts/escrow.clar', privateKey);
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  await deployContract('reputation', './contracts/reputation.clar', privateKey);
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  await deployContract('dispute', './contracts/dispute.clar', privateKey);

  console.log('\n✅ All contracts deployed successfully!');
}

main().catch(console.error);
