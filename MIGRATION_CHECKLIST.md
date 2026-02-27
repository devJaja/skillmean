# Skills-Bridge Migration Checklist

## ✅ Completed

- [x] Core escrow contract in Clarity (`escrow.clar`)
- [x] Reputation/profile contract (`reputation.clar`)
- [x] Dispute resolution contract (`dispute.clar`)
- [x] Clarinet configuration (`Clarinet.toml`)
- [x] Test suite for escrow
- [x] Test suite for reputation
- [x] Deployment script
- [x] Comprehensive documentation

## 🔄 Next Steps

### 1. Install Clarinet
```bash
# Linux
curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64.tar.gz | tar xz
sudo mv clarinet /usr/local/bin/

# macOS
brew install clarinet

# Verify
clarinet --version
```

### 2. Test Contracts Locally
```bash
# Check syntax
clarinet check

# Run tests
clarinet test

# Interactive console
clarinet console
```

### 3. Deploy to Testnet
```bash
# Option 1: Use deployment script
./deploy.sh

# Option 2: Manual deployment
clarinet deploy --testnet
```

### 4. Frontend Migration

#### Install Stacks.js
```bash
cd frontend
npm install @stacks/connect @stacks/transactions @stacks/network
```

#### Replace Web3 Wallet Integration
- Remove: MetaMask, WalletConnect
- Add: Leather Wallet, Xverse Wallet

#### Update Contract Calls
- Replace `ethers.js` with `@stacks/transactions`
- Update all contract interaction code
- Change from ETH/USDC to STX/sUSDT

### 5. Update Environment Variables
```bash
# .env
VITE_NETWORK=testnet
VITE_CONTRACT_ADDRESS_ESCROW=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.escrow
VITE_CONTRACT_ADDRESS_REPUTATION=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.reputation
VITE_CONTRACT_ADDRESS_DISPUTE=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dispute
```

## 📋 Frontend Changes Required

### Components to Update
- [ ] Wallet connection component (MetaMask → Leather/Xverse)
- [ ] Job posting form (ETH → STX amounts)
- [ ] Payment display (wei → microSTX conversion)
- [ ] Transaction status tracking
- [ ] Network switcher (Ethereum → Stacks)

### New Features to Add
- [ ] Bitcoin block confirmation display
- [ ] STX → USD price feed
- [ ] Stacks explorer links
- [ ] Post-condition builder for transactions

## 🔐 Security Considerations

- [ ] Audit Clarity contracts
- [ ] Test all edge cases
- [ ] Implement post-conditions for all transactions
- [ ] Add rate limiting on frontend
- [ ] Set up monitoring for contract events

## 🌍 Deployment Checklist

### Testnet
- [ ] Deploy all three contracts
- [ ] Verify on Stacks Explorer
- [ ] Test all functions end-to-end
- [ ] Get testnet STX from faucet
- [ ] Test with real users

### Mainnet
- [ ] Complete security audit
- [ ] Test extensively on testnet
- [ ] Prepare deployment wallet with STX
- [ ] Deploy during low-traffic period
- [ ] Verify all contracts on explorer
- [ ] Update frontend with mainnet addresses
- [ ] Announce launch

## 📊 Key Differences Summary

| Aspect | EVM Version | Stacks Version |
|--------|-------------|----------------|
| Language | Solidity | Clarity |
| Currency | ETH | STX |
| Stablecoin | USDC (ERC-20) | sUSDT (SIP-010) |
| Wallet | MetaMask | Leather, Xverse |
| Explorer | Etherscan | Stacks Explorer |
| Testnet | Sepolia | Stacks Testnet |
| Gas | Gwei | microSTX |
| Finality | ~15 sec | ~10 min (Bitcoin) |

## 💡 Advantages of Stacks

1. **Bitcoin Security** - Inherits Bitcoin's security model
2. **No Reentrancy** - Clarity prevents reentrancy by design
3. **Decidable** - Can analyze contract behavior before deployment
4. **Lower Fees** - Generally cheaper than Ethereum mainnet
5. **Growing Ecosystem** - Bitcoin DeFi is expanding
6. **African Adoption** - Bitcoin has strong presence in Nigeria

## 🚀 Quick Start

```bash
# 1. Check everything is ready
clarinet check

# 2. Run tests
clarinet test

# 3. Deploy to testnet
./deploy.sh

# 4. Update frontend
cd frontend
npm install @stacks/connect @stacks/transactions
# Update wallet integration code

# 5. Test end-to-end
# - Connect wallet
# - Post a job
# - Accept job
# - Complete workflow
```

## 📚 Resources

- [Clarity Book](https://book.clarity-lang.org/)
- [Stacks Documentation](https://docs.stacks.co/)
- [Clarinet Guide](https://docs.hiro.so/clarinet)
- [Stacks.js Docs](https://stacks.js.org/)
- [Hiro Platform](https://www.hiro.so/)

---

**Status**: Ready for testnet deployment 🚀
