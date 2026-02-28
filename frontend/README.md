# Skills-Bridge Frontend

React + TypeScript + Vite frontend for Skills-Bridge on Stacks.

## Features

- 🔐 Stacks wallet integration (Leather, Xverse)
- 💼 Post jobs with STX escrow
- ✅ Accept and complete jobs
- 💰 Automatic payment release
- 📊 Real-time job status tracking
- 🎨 Modern UI with Tailwind CSS

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Contract Integration

The frontend connects to deployed mainnet contracts:
- **Escrow**: `SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC.escrow`
- **Reputation**: `SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC.reputation`
- **Dispute**: `SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC.dispute`

## Usage

1. Connect your Stacks wallet (Leather or Xverse)
2. Post a job with title, amount, and deadline
3. Professionals can accept jobs
4. Submit work when complete
5. Client approves and payment releases automatically

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- @stacks/connect
- @stacks/transactions
