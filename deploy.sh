#!/bin/bash

# Skills-Bridge Stacks Deployment Script
# This script helps deploy Skills-Bridge contracts to Stacks blockchain

set -e

echo "🧱 Skills-Bridge Stacks Deployment"
echo "=================================="
echo ""

# Check if clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo "❌ Clarinet is not installed"
    echo "📦 Installing Clarinet..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64.tar.gz | tar xz
        sudo mv clarinet /usr/local/bin/
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install clarinet
    else
        echo "❌ Unsupported OS. Please install Clarinet manually from:"
        echo "https://github.com/hirosystems/clarinet"
        exit 1
    fi
fi

echo "✅ Clarinet installed: $(clarinet --version)"
echo ""

# Check contracts
echo "🔍 Checking contract syntax..."
clarinet check

if [ $? -eq 0 ]; then
    echo "✅ All contracts are valid"
else
    echo "❌ Contract check failed"
    exit 1
fi

echo ""

# Run tests
echo "🧪 Running tests..."
clarinet test

if [ $? -eq 0 ]; then
    echo "✅ All tests passed"
else
    echo "❌ Tests failed"
    exit 1
fi

echo ""

# Deployment options
echo "📋 Deployment Options:"
echo "1. Deploy to Devnet (local)"
echo "2. Deploy to Testnet"
echo "3. Deploy to Mainnet"
echo "4. Exit"
echo ""

read -p "Select option (1-4): " option

case $option in
    1)
        echo "🚀 Starting local devnet..."
        clarinet integrate
        ;;
    2)
        echo "🌐 Deploying to Testnet..."
        echo ""
        echo "⚠️  Make sure you have:"
        echo "  - STX in your testnet wallet"
        echo "  - Configured your wallet in settings/Testnet.toml"
        echo ""
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            clarinet deploy --testnet
            echo ""
            echo "✅ Deployed to Testnet!"
            echo "🔍 View on explorer: https://explorer.hiro.so/?chain=testnet"
        fi
        ;;
    3)
        echo "🌐 Deploying to Mainnet..."
        echo ""
        echo "⚠️  WARNING: This will deploy to MAINNET and cost real STX!"
        echo "⚠️  Make sure you have:"
        echo "  - Sufficient STX for deployment fees"
        echo "  - Configured your wallet in settings/Mainnet.toml"
        echo "  - Audited your contracts thoroughly"
        echo ""
        read -p "Are you ABSOLUTELY sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            clarinet deployment generate --mainnet
            clarinet deployment apply -p deployments/default.mainnet-plan.yaml
            echo ""
            echo "✅ Deployed to Mainnet!"
            echo "🔍 View on explorer: https://explorer.hiro.so/"
        else
            echo "❌ Mainnet deployment cancelled"
        fi
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Update frontend with deployed contract addresses"
echo "  2. Test contract interactions"
echo "  3. Update documentation with contract addresses"
echo ""
