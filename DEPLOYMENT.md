# Deployment Guide

## Prerequisites

1. **Stacks Wallet with STX**
   - Testnet: Get free STX from [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet)
   - Mainnet: Purchase STX from exchanges

2. **Private Key**
   - Export from Leather/Xverse wallet
   - Keep it secure and never commit to git

3. **Dependencies**
   ```bash
   npm install @stacks/transactions @stacks/network ts-node typescript
   ```

## Deployment Steps

### Option 1: Using Deployment Script (Recommended)

```bash
# Set your private key
export STACKS_PRIVATE_KEY='your_64_char_hex_private_key'

# Run deployment script
cd scripts
./deploy.sh

# Choose:
# 1 = Testnet (free, for testing)
# 2 = Mainnet (costs real STX)
```

### Option 2: Manual Deployment

#### Testnet
```bash
export STACKS_PRIVATE_KEY='your_private_key'
npx ts-node scripts/deploy-testnet.ts
```

#### Mainnet
```bash
export STACKS_PRIVATE_KEY='your_private_key'
npx ts-node scripts/deploy-mainnet.ts
```

## Verify Deployment

```bash
# After deployment, verify contracts
./scripts/verify.sh YOUR_ADDRESS testnet
# or
./scripts/verify.sh YOUR_ADDRESS mainnet
```

## Cost Estimates

### Testnet
- Free (use faucet STX)

### Mainnet
- Escrow contract: ~0.5 STX
- Reputation contract: ~0.4 STX
- Dispute contract: ~0.3 STX
- **Total: ~1.2 STX** (+ network fees)

## Post-Deployment

1. **Save Contract Addresses**
   ```
   Escrow: YOUR_ADDRESS.escrow
   Reputation: YOUR_ADDRESS.reputation
   Dispute: YOUR_ADDRESS.dispute
   ```

2. **Update Frontend**
   - Update `.env` with deployed addresses
   - Update network configuration

3. **Test Contracts**
   - Post a test job
   - Accept and complete workflow
   - Verify all functions work

## Troubleshooting

### "Insufficient funds"
- Ensure wallet has enough STX for deployment + fees
- Testnet: Use faucet
- Mainnet: Add more STX

### "Transaction failed"
- Check contract syntax: `clarinet check`
- Verify network connectivity
- Check Stacks blockchain status

### "Private key invalid"
- Ensure 64-character hex format
- No spaces or special characters
- Export correctly from wallet

## Security Notes

⚠️ **NEVER commit private keys to git**
⚠️ **Test thoroughly on testnet first**
⚠️ **Audit contracts before mainnet deployment**
⚠️ **Keep deployment keys secure**

## Support

- [Stacks Discord](https://discord.gg/stacks)
- [Hiro Documentation](https://docs.hiro.so)
- [GitHub Issues](https://github.com/devJaja/skillmean/issues)
