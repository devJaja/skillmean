# Contract Interaction Scripts

Scripts to interact with deployed Skills-Bridge contracts on Stacks mainnet.

## Contract Address
`SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC`

## Scripts

### 1. interact.sh - Interactive CLI
```bash
./interact.sh
```
Menu-driven interface for all contract functions:
- Post jobs
- Accept jobs
- Submit work
- Approve work
- View job details
- Create profiles
- Submit ratings

**Requirements**: Stacks CLI (`npm install -g @stacks/cli`)

### 2. query.js - Read-Only Queries
```bash
# View job details
node query.js job 1

# View profile
node query.js profile SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC

# Get average rating
node query.js rating SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC

# Check escrow balance
node query.js balance 1
```

**Requirements**: Node.js + dependencies
```bash
npm install @stacks/transactions @stacks/network
```

### 3. api-query.py - Python API Queries
```bash
# Get job info
python3 api-query.py job 1

# Get profile
python3 api-query.py profile SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC

# Get contract info
python3 api-query.py info

# Get recent transactions
python3 api-query.py txs
```

**Requirements**: Python 3 + requests
```bash
pip install requests
```

### 4. monitor.sh - Real-Time Monitor
```bash
./monitor.sh
```
Live monitoring of:
- Recent transactions
- Contract balance
- Transaction status
- Auto-refresh every 10 seconds

**Requirements**: curl, jq

## Quick Examples

### Post a Job
```bash
./interact.sh
# Select 1
# Enter: "Build website", 1, 100
```

### Query Job Status
```bash
node query.js job 1
```

### Monitor Activity
```bash
./monitor.sh
```

## API Endpoints

All scripts use Hiro API:
- **Mainnet**: https://api.hiro.so
- **Explorer**: https://explorer.hiro.so

## Transaction Costs

- Post job: ~0.01 STX
- Accept job: ~0.01 STX
- Submit work: ~0.01 STX
- Approve work: ~0.01 STX
- Read queries: FREE

## Troubleshooting

### "stx command not found"
```bash
npm install -g @stacks/cli
```

### "Module not found"
```bash
npm install @stacks/transactions @stacks/network
```

### "jq command not found"
```bash
# Ubuntu/Debian
sudo apt install jq

# macOS
brew install jq
```

## Security Notes

- Never share private keys
- Test with small amounts first
- Verify transaction details before signing
- Monitor contract activity regularly
