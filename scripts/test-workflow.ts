import { postJob, acceptJob, submitWork, approveWork } from './interact-escrow';
import { createProfile, submitRating } from './interact-reputation';
import { getJob, getProfile, getAverageRating } from './read-contract';

async function runFullWorkflow() {
  const clientKey = process.env.STACKS_PRIVATE_KEY!;
  const professionalKey = process.env.STACKS_PRIVATE_KEY_2!;
  
  console.log('🔄 Starting full workflow test...\n');

  // Step 1: Create profiles
  console.log('1️⃣ Creating professional profile...');
  await createProfile(
    'johndoe',
    'Full-stack developer with 5 years experience',
    'JavaScript, React, Clarity',
    professionalKey
  );
  await sleep(5000);

  // Step 2: Post a job
  console.log('\n2️⃣ Client posting job...');
  const jobTxid = await postJob(
    'Build DApp',
    1000000, // 1 STX
    100, // 100 blocks deadline
    clientKey
  );
  await sleep(10000);

  // Step 3: Query job
  console.log('\n3️⃣ Querying job details...');
  const job = await getJob(1);
  console.log('Job:', job);

  // Step 4: Accept job
  console.log('\n4️⃣ Professional accepting job...');
  await acceptJob(1, professionalKey);
  await sleep(10000);

  // Step 5: Submit work
  console.log('\n5️⃣ Professional submitting work...');
  await submitWork(1, professionalKey);
  await sleep(10000);

  // Step 6: Approve work
  console.log('\n6️⃣ Client approving work...');
  await approveWork(1, clientKey);
  await sleep(10000);

  // Step 7: Submit rating
  console.log('\n7️⃣ Client submitting rating...');
  await submitRating(
    1,
    'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', // Professional address
    5,
    'Excellent work!',
    clientKey
  );
  await sleep(10000);

  // Step 8: Query final state
  console.log('\n8️⃣ Querying final state...');
  const finalJob = await getJob(1);
  const profile = await getProfile('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
  const rating = await getAverageRating('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
  
  console.log('\n📊 Final Results:');
  console.log('Job:', finalJob);
  console.log('Profile:', profile);
  console.log('Rating:', rating);

  console.log('\n✅ Full workflow completed successfully!');
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

runFullWorkflow().catch(console.error);
