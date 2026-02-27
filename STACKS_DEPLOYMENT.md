# Skills-Bridge on Stacks (Bitcoin L2)

## 🔄 Migration from EVM to Stacks

This is the Clarity smart contract implementation of Skills-Bridge, migrated from Solidity/EVM to deploy on Stacks blockchain (Bitcoin Layer 2).

## 📋 Contracts Overview

### 1. **escrow.clar** - Core Escrow Logic
- Post jobs and lock STX in escrow
- Accept jobs as a professional
- Submit completed work
- Approve work and release payment
- Cancel jobs (if not accepted)
- Raise disputes

### 2. **reputation.clar** - On-Chain Profiles & Ratings
- Create professional profiles
- Update profile information
- Record job completions
- Submit ratings (1-5 stars)
- Calculate average ratings and completion rates

### 3. **dispute.clar** - Arbitration System
- Create disputes for problematic jobs
- Submit evidence from both parties
- Arbitrator resolution system
- Multiple outcome options (client wins, professional wins, split)

## 🚀 Deployment Guide

### Prerequisites
```bash
# Install Clarinet (Stacks smart contract development tool)
curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/

# Verify installation
clarinet --version
```

### Setup Project
```bash
# Initialize Clarinet project (if not already done)
clarinet new skills-bridge-stacks
cd skills-bridge-stacks

# Copy contracts to contracts/ directory
cp /path/to/escrow.clar contracts/
cp /path/to/reputation.clar contracts/
cp /path/to/dispute.clar contracts/
```

### Configure Clarinet.toml
```toml
[project]
name = "skills-bridge"
description = "Decentralized skills marketplace on Bitcoin"
authors = ["devjaja"]
telemetry = false

[contracts.escrow]
path = "contracts/escrow.clar"

[contracts.reputation]
path = "contracts/reputation.clar"

[contracts.dispute]
path = "contracts/dispute.clar"
```

### Test Contracts
```bash
# Check syntax
clarinet check

# Run tests (create tests in tests/ directory)
clarinet test

# Open console for interactive testing
clarinet console
```

### Deploy to Testnet
```bash
# Deploy to Stacks testnet
clarinet deploy --testnet

# Or use Clarinet integrated devnet
clarinet integrate
```

### Deploy to Mainnet
```bash
# Generate deployment plan
clarinet deployment generate --mainnet

# Deploy to mainnet (requires STX for fees)
clarinet deployment apply -p deployments/default.mainnet-plan.yaml
```

## 🔧 Key Differences from Solidity Version

| Feature | Solidity/EVM | Clarity/Stacks |
|---------|--------------|----------------|
| **Native Currency** | ETH | STX |
| **Stablecoins** | USDC/USDT (ERC-20) | sUSDT/xUSD (SIP-010) |
| **Wallet** | MetaMask | Leather, Xverse |
| **Language** | Solidity | Clarity |
| **Security** | Runtime checks | Decidable, no reentrancy |
| **Finality** | Bitcoin L1 finality | Bitcoin L1 finality |

## 💻 Frontend Integration

### Install Stacks.js
```bash
npm install @stacks/connect @stacks/transactions @stacks/network
```

### Connect Wallet (React Example)
```javascript
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function connectWallet() {
  showConnect({
    appDetails: {
      name: 'Skills-Bridge',
      icon: window.location.origin + '/logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}
```

### Call Contract Functions
```javascript
import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  stringAsciiCV, 
  PostConditionMode 
} from '@stacks/transactions';

// Post a job
async function postJob(title, amount, deadline) {
  const functionArgs = [
    stringAsciiCV(title),
    uintCV(amount),
    uintCV(deadline),
  ];

  await openContractCall({
    network: new StacksTestnet(),
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'escrow',
    functionName: 'post-job',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Transaction ID:', data.txId);
    },
  });
}
```

### Read Contract Data
```javascript
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';

async function getJob(jobId) {
  const result = await callReadOnlyFunction({
    network: new StacksTestnet(),
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'escrow',
    functionName: 'get-job',
    functionArgs: [uintCV(jobId)],
    senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  });

  return cvToJSON(result);
}
```

## 🧪 Testing Examples

Create `tests/escrow_test.ts`:
```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can post a job and lock funds",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const client = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'escrow',
        'post-job',
        [
          types.ascii("Build a website"),
          types.uint(1000000), // 1 STX
          types.uint(100) // deadline block
        ],
        client.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.receipts[0].result, '(ok u1)');
  },
});
```

## 📊 Gas Costs (Approximate)

| Function | STX Cost (Testnet) |
|----------|-------------------|
| post-job | ~0.001 STX |
| accept-job | ~0.0005 STX |
| submit-work | ~0.0005 STX |
| approve-work | ~0.001 STX |
| create-profile | ~0.0008 STX |
| submit-rating | ~0.0006 STX |

## 🔐 Security Features

- **No reentrancy attacks** - Clarity is decidable and prevents reentrancy by design
- **Post-conditions** - Enforce expected state changes before transaction execution
- **Bitcoin finality** - All transactions settle on Bitcoin L1
- **Auditable** - All contract code is readable and verifiable on-chain

## 🌍 Network Information

### Testnet
- **Network**: Stacks Testnet
- **Explorer**: https://explorer.hiro.so/?chain=testnet
- **Faucet**: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- **RPC**: https://stacks-node-api.testnet.stacks.co

### Mainnet
- **Network**: Stacks Mainnet
- **Explorer**: https://explorer.hiro.so/
- **RPC**: https://stacks-node-api.mainnet.stacks.co

## 📚 Resources

- [Clarity Language Reference](https://docs.stacks.co/clarity/overview)
- [Stacks.js Documentation](https://stacks.js.org/)
- [Clarinet Documentation](https://docs.hiro.so/clarinet/getting-started)
- [Hiro Platform](https://www.hiro.so/)

## 🚧 Roadmap Adjustments for Stacks

- ✅ Core escrow functionality (STX-based)
- ✅ Reputation system
- ✅ Basic dispute resolution
- 🔄 SIP-010 token support (for stablecoins like sUSDT)
- 🔄 Mobile wallet integration (Leather mobile, Xverse)
- 🔄 Bitcoin L1 anchoring verification UI
- 🔄 DAO governance using Clarity traits

## 💡 Why Stacks/Bitcoin?

1. **Bitcoin Security** - Inherits Bitcoin's security and finality
2. **Lower Fees** - More affordable than Ethereum mainnet
3. **Clarity Language** - More secure, decidable, no reentrancy
4. **Growing Ecosystem** - Bitcoin DeFi is expanding rapidly
5. **African Adoption** - Bitcoin has strong adoption in Nigeria and Africa

---

**Your skills. Your earnings. Your future. On Bitcoin.**
