#!/bin/bash
set -e

echo "🧪 Skills-Bridge Contract Testing"
echo "=================================="
echo ""

if [ -z "$STACKS_PRIVATE_KEY" ]; then
    echo "❌ STACKS_PRIVATE_KEY not set"
    exit 1
fi

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ CONTRACT_ADDRESS not set"
    exit 1
fi

echo "📋 Configuration:"
echo "   Network: ${NETWORK:-testnet}"
echo "   Contract: $CONTRACT_ADDRESS"
echo ""

echo "Select test scenario:"
echo "1. Post a job"
echo "2. Accept a job"
echo "3. Submit work"
echo "4. Approve work"
echo "5. Create profile"
echo "6. Submit rating"
echo "7. Query job details"
echo "8. Query profile"
echo "9. Full workflow test"
echo ""

read -p "Enter choice (1-9): " choice

case $choice in
    1)
        read -p "Job title: " title
        read -p "Amount (microSTX): " amount
        read -p "Deadline (blocks): " deadline
        npx ts-node -e "
        import { postJob } from './scripts/interact-escrow';
        postJob('$title', $amount, $deadline, process.env.STACKS_PRIVATE_KEY!);
        "
        ;;
    2)
        read -p "Job ID: " jobId
        npx ts-node -e "
        import { acceptJob } from './scripts/interact-escrow';
        acceptJob($jobId, process.env.STACKS_PRIVATE_KEY!);
        "
        ;;
    3)
        read -p "Job ID: " jobId
        npx ts-node -e "
        import { submitWork } from './scripts/interact-escrow';
        submitWork($jobId, process.env.STACKS_PRIVATE_KEY!);
        "
        ;;
    4)
        read -p "Job ID: " jobId
        npx ts-node -e "
        import { approveWork } from './scripts/interact-escrow';
        approveWork($jobId, process.env.STACKS_PRIVATE_KEY!);
        "
        ;;
    5)
        read -p "Username: " username
        read -p "Bio: " bio
        read -p "Skills: " skills
        npx ts-node -e "
        import { createProfile } from './scripts/interact-reputation';
        createProfile('$username', '$bio', '$skills', process.env.STACKS_PRIVATE_KEY!);
        "
        ;;
    6)
        read -p "Job ID: " jobId
        read -p "Professional address: " professional
        read -p "Rating (1-5): " rating
        read -p "Comment: " comment
        npx ts-node -e "
        import { submitRating } from './scripts/interact-reputation';
        submitRating($jobId, '$professional', $rating, '$comment', process.env.STACKS_PRIVATE_KEY!);
        "
        ;;
    7)
        read -p "Job ID: " jobId
        npx ts-node -e "
        import { getJob } from './scripts/read-contract';
        getJob($jobId).then(console.log);
        "
        ;;
    8)
        read -p "User address: " address
        npx ts-node -e "
        import { getProfile, getAverageRating } from './scripts/read-contract';
        Promise.all([
          getProfile('$address'),
          getAverageRating('$address')
        ]).then(([profile, rating]) => {
          console.log('Profile:', profile);
          console.log('Rating:', rating);
        });
        "
        ;;
    9)
        echo ""
        echo "🔄 Running full workflow test..."
        npx ts-node scripts/test-workflow.ts
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
