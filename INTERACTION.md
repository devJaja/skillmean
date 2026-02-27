# Contract Interaction Guide

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables**
   ```bash
   export STACKS_PRIVATE_KEY='your_private_key'
   export CONTRACT_ADDRESS='deployed_contract_address'
   export NETWORK='testnet' # or 'mainnet'
   ```

## Interaction Scripts

### 1. Post a Job
```bash
npm run interact
# Select option 1
# Enter: title, amount (microSTX), deadline (blocks)
```

Or programmatically:
```typescript
import { postJob } from './scripts/interact-escrow';

await postJob(
  'Build a website',
  1000000, // 1 STX
  100, // 100 blocks
  privateKey
);
```

### 2. Accept a Job
```bash
npm run interact
# Select option 2
# Enter: job ID
```

### 3. Submit Work
```bash
npm run interact
# Select option 3
# Enter: job ID
```

### 4. Approve Work & Release Payment
```bash
npm run interact
# Select option 4
# Enter: job ID
```

### 5. Create Profile
```bash
npm run interact
# Select option 5
# Enter: username, bio, skills
```

### 6. Submit Rating
```bash
npm run interact
# Select option 6
# Enter: job ID, professional address, rating (1-5), comment
```

### 7. Query Job Details
```bash
npm run interact
# Select option 7
# Enter: job ID
```

### 8. Query Profile
```bash
npm run interact
# Select option 8
# Enter: user address
```

### 9. Full Workflow Test
```bash
npm run test:workflow
```

## Read-Only Queries

```typescript
import { 
  getJob, 
  getProfile, 
  getAverageRating,
  getCompletionRate 
} from './scripts/read-contract';

// Get job details
const job = await getJob(1);

// Get user profile
const profile = await getProfile('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');

// Get average rating
const rating = await getAverageRating('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');

// Get completion rate
const rate = await getCompletionRate('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
```

## Transaction Costs

All interactions cost approximately **0.01 STX** (~$0.01 USD) per transaction:

- Post job: 0.01 STX
- Accept job: 0.01 STX
- Submit work: 0.01 STX
- Approve work: 0.01 STX
- Create profile: 0.01 STX
- Submit rating: 0.01 STX

**Total for full workflow: ~0.06 STX**

## Example: Complete Job Flow

```typescript
// 1. Client posts job
await postJob('Build DApp', 1000000, 100, clientKey);

// 2. Professional accepts
await acceptJob(1, professionalKey);

// 3. Professional submits work
await submitWork(1, professionalKey);

// 4. Client approves & pays
await approveWork(1, clientKey);

// 5. Client rates professional
await submitRating(1, professionalAddress, 5, 'Great work!', clientKey);
```

## Monitoring Transactions

View transactions on Stacks Explorer:
- **Testnet**: https://explorer.hiro.so/?chain=testnet
- **Mainnet**: https://explorer.hiro.so/

Search by transaction ID or contract address.
