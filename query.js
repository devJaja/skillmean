const { StacksMainnet } = require('@stacks/network');
const { callReadOnlyFunction, cvToJSON, uintCV, principalCV } = require('@stacks/transactions');

const CONTRACT_ADDRESS = 'SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC';
const network = new StacksMainnet();

async function getJob(jobId) {
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

async function getProfile(address) {
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

async function getAverageRating(address) {
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

async function getEscrowBalance(jobId) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'escrow',
    functionName: 'get-escrow-balance',
    functionArgs: [uintCV(jobId)],
    network,
    senderAddress: CONTRACT_ADDRESS,
  });
  return cvToJSON(result);
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

(async () => {
  switch(command) {
    case 'job':
      const job = await getJob(parseInt(args[1]));
      console.log(JSON.stringify(job, null, 2));
      break;
    case 'profile':
      const profile = await getProfile(args[1]);
      console.log(JSON.stringify(profile, null, 2));
      break;
    case 'rating':
      const rating = await getAverageRating(args[1]);
      console.log(JSON.stringify(rating, null, 2));
      break;
    case 'balance':
      const balance = await getEscrowBalance(parseInt(args[1]));
      console.log(JSON.stringify(balance, null, 2));
      break;
    default:
      console.log('Usage:');
      console.log('  node query.js job <jobId>');
      console.log('  node query.js profile <address>');
      console.log('  node query.js rating <address>');
      console.log('  node query.js balance <jobId>');
  }
})();
