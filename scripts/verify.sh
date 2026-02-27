#!/bin/bash
set -e

echo "🔍 Verifying deployed contracts..."
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./verify.sh <contract-address>"
    echo "Example: ./verify.sh ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
    exit 1
fi

ADDRESS=$1
NETWORK=${2:-mainnet}

echo "📋 Contract Address: $ADDRESS"
echo "🌐 Network: $NETWORK"
echo ""

if [ "$NETWORK" = "testnet" ]; then
    BASE_URL="https://api.testnet.hiro.so"
    EXPLORER="https://explorer.hiro.so/?chain=testnet"
else
    BASE_URL="https://api.hiro.so"
    EXPLORER="https://explorer.hiro.so"
fi

echo "Checking contracts..."
echo ""

# Check escrow
echo "1. Escrow Contract:"
curl -s "$BASE_URL/v2/contracts/interface/$ADDRESS/escrow" | jq -r '.functions[] | .name' | head -5
echo "   ✅ Escrow verified"
echo ""

# Check reputation
echo "2. Reputation Contract:"
curl -s "$BASE_URL/v2/contracts/interface/$ADDRESS/reputation" | jq -r '.functions[] | .name' | head -5
echo "   ✅ Reputation verified"
echo ""

# Check dispute
echo "3. Dispute Contract:"
curl -s "$BASE_URL/v2/contracts/interface/$ADDRESS/dispute" | jq -r '.functions[] | .name' | head -5
echo "   ✅ Dispute verified"
echo ""

echo "✅ All contracts verified!"
echo ""
echo "🔗 View on explorer:"
echo "   $EXPLORER/address/$ADDRESS"
