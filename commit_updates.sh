#!/bin/bash

# Stage and commit deployment optimizations
git add scripts/deploy-mainnet.ts scripts/deploy-testnet.ts
git commit -m "perf(deploy): optimize deployment fees to 0.15 STX total

- Reduce mainnet deployment fee to 0.05 STX per contract
- Reduce testnet deployment fee to 0.02 STX per contract
- Total mainnet deployment cost: 0.15 STX (down from 1.2 STX)
- Ensures affordable deployment for Nigerian developers"

# Commit escrow interaction script
git add scripts/interact-escrow.ts
git commit -m "feat(scripts): add escrow contract interaction functions

- postJob: Create new job with STX escrow
- acceptJob: Professional accepts job
- submitWork: Submit completed work
- approveWork: Release payment to professional
- All transactions optimized to 0.01 STX fee"

# Commit reputation interaction script
git add scripts/interact-reputation.ts
git commit -m "feat(scripts): add reputation contract interaction functions

- createProfile: Create professional profile on-chain
- updateProfile: Update bio and skills
- submitRating: Submit 1-5 star ratings with comments
- Build verifiable on-chain reputation system"

# Commit read-only queries
git add scripts/read-contract.ts
git commit -m "feat(scripts): add read-only contract query functions

- getJob: Query job details and status
- getProfile: Fetch professional profiles
- getAverageRating: Calculate average ratings
- getCompletionRate: Get job completion percentage
- All queries are free (no transaction fees)"

# Commit interactive test script
git add scripts/test-contract.sh
git commit -m "feat(scripts): add interactive contract testing CLI

- Menu-driven interface for all contract functions
- Support for posting jobs, accepting, and completing workflow
- Profile management and rating submission
- Real-time transaction feedback"

# Commit workflow test
git add scripts/test-workflow.ts
git commit -m "test(scripts): add automated end-to-end workflow test

- Complete job lifecycle: post → accept → submit → approve
- Profile creation and rating submission
- Automated verification of contract state
- Useful for CI/CD and integration testing"

# Commit verification script updates
git add scripts/verify.sh
git commit -m "feat(scripts): enhance contract verification script

- Verify all three deployed contracts
- Support for both testnet and mainnet
- Display contract functions via API
- Generate explorer links for easy access"

# Commit interaction documentation
git add INTERACTION.md
git commit -m "docs: add comprehensive contract interaction guide

- Step-by-step interaction examples
- Code snippets for all contract functions
- Transaction cost breakdown
- Complete workflow examples"

# Commit deployment documentation updates
git add DEPLOYMENT.md
git commit -m "docs: update deployment guide with optimized costs

- Reflect new 0.15 STX mainnet deployment cost
- Add troubleshooting section
- Include security best practices
- Update cost estimates and examples"

# Commit package.json updates
git add package.json
git commit -m "chore: add interaction and testing scripts to package.json

- npm run interact: Interactive contract testing
- npm run test:workflow: Automated workflow test
- Add required dependencies for contract interaction
- Update deployment script commands"

# Commit TypeScript config
git add tsconfig.json
git commit -m "config: add TypeScript configuration for scripts

- Configure ES2020 target for modern features
- Enable strict mode for type safety
- Set up module resolution for Node.js
- Include scripts directory in compilation"

# Commit environment template updates
git add .env.example
git commit -m "config: update environment variables template

- Add CONTRACT_ADDRESS for deployed contracts
- Include STACKS_PRIVATE_KEY_2 for testing
- Document all required environment variables
- Add usage instructions in comments"

# Commit gitignore updates
git add .gitignore
git commit -m "security: enhance gitignore for private keys

- Prevent committing .env files
- Block all private key files (*.key, *.pem)
- Add private-key.txt to exclusions
- Protect sensitive deployment credentials"

# Commit README updates if exists, or create summary
git add README.md 2>/dev/null || echo "# Skills-Bridge on Stacks

Decentralized skills marketplace on Bitcoin Layer 2 (Stacks blockchain).

## Quick Start
\`\`\`bash
npm install
npm run deploy:testnet
npm run interact
\`\`\`

See [DEPLOYMENT.md](DEPLOYMENT.md) and [INTERACTION.md](INTERACTION.md) for details.
" > README.md && git add README.md

git commit -m "docs: add project README with quick start guide

- Overview of Skills-Bridge on Stacks
- Quick start commands
- Links to detailed documentation
- Professional project presentation"

# Final commit - project polish
git add .
git commit -m "chore: finalize Skills-Bridge Stacks deployment scripts

- Complete deployment infrastructure (0.15 STX cost)
- Full contract interaction suite
- Comprehensive testing and verification tools
- Production-ready for mainnet deployment
- Optimized for Nigerian developers and global access"

echo "✅ Created 15 professional commits!"
