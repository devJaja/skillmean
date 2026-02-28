#!/bin/bash
# Monitor contract activity in real-time

CONTRACT_ADDRESS="SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC"
API_URL="https://api.hiro.so"

echo "📊 Skills-Bridge Contract Monitor"
echo "=================================="
echo "Contract: $CONTRACT_ADDRESS"
echo ""

while true; do
  clear
  echo "📊 Skills-Bridge Live Monitor"
  echo "=============================="
  echo "Time: $(date)"
  echo ""
  
  # Get latest transactions
  echo "🔄 Recent Transactions:"
  curl -s "$API_URL/extended/v1/address/$CONTRACT_ADDRESS/transactions?limit=5" | \
    jq -r '.results[] | "\(.tx_type) - \(.tx_status) - \(.block_height // "pending")"'
  
  echo ""
  echo "💰 Contract Balance:"
  curl -s "$API_URL/v2/accounts/$CONTRACT_ADDRESS" | \
    jq -r '.balance | tonumber / 1000000 | "\(.) STX"'
  
  echo ""
  echo "Refreshing in 10 seconds... (Ctrl+C to stop)"
  sleep 10
done
