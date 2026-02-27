#!/bin/bash
set -e

echo "🚀 Skills-Bridge Deployment Script"
echo "===================================="
echo ""

# Check for private key
if [ -z "$STACKS_PRIVATE_KEY" ]; then
    echo "❌ Error: STACKS_PRIVATE_KEY environment variable not set"
    echo ""
    echo "Set it with:"
    echo "  export STACKS_PRIVATE_KEY='your_private_key_here'"
    exit 1
fi

# Check dependencies
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install @stacks/transactions @stacks/network
fi

# Deployment menu
echo "Select deployment target:"
echo "1. Testnet (recommended for testing)"
echo "2. Mainnet (production - costs real STX)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🧪 Deploying to TESTNET..."
        echo ""
        npx ts-node scripts/deploy-testnet.ts
        ;;
    2)
        echo ""
        echo "⚠️  WARNING: Deploying to MAINNET"
        echo "   This will cost real STX tokens!"
        echo ""
        read -p "Type 'DEPLOY' to confirm: " confirm
        
        if [ "$confirm" = "DEPLOY" ]; then
            echo ""
            echo "🚀 Deploying to MAINNET..."
            echo ""
            npx ts-node scripts/deploy-mainnet.ts
        else
            echo "❌ Deployment cancelled"
            exit 1
        fi
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment complete!"
