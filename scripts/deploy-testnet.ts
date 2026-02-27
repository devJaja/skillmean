import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import * as fs from 'fs';

const network = new StacksTestnet();

async function deployContract(contractName: string, contractPath: string, senderKey: string) {
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  
  const txOptions = {
    contractName,
    codeBody,
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    fee: 20000, // 0.02 STX per contract
  };

  const transaction = await makeContractDeploy(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  
  console.log(`✅ ${contractName} deployed: ${broadcastResponse.txid}`);
  console.log(`   View: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=testnet\n`);
  
  return broadcastResponse.txid;
}

async function main() {
  const privateKey = process.env.STACKS_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('STACKS_PRIVATE_KEY environment variable required');
  }

  console.log('🧪 Deploying Skills-Bridge to Stacks Testnet...\n');

  const escrowTxid = await deployContract('escrow', './contracts/escrow.clar', privateKey);
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  const reputationTxid = await deployContract('reputation', './contracts/reputation.clar', privateKey);
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  const disputeTxid = await deployContract('dispute', './contracts/dispute.clar', privateKey);

  console.log('✅ All contracts deployed to testnet!');
  console.log('\n📋 Deployment Summary:');
  console.log(`   Escrow: ${escrowTxid}`);
  console.log(`   Reputation: ${reputationTxid}`);
  console.log(`   Dispute: ${disputeTxid}`);
}

main().catch(console.error);
