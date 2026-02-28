#!/bin/bash
# Quick interaction script for deployed Skills-Bridge contracts

CONTRACT_ADDRESS="SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC"
NETWORK="mainnet"

echo "🔗 Skills-Bridge Contract Interaction"
echo "======================================"
echo "Contract: $CONTRACT_ADDRESS"
echo ""

# Menu
echo "Select action:"
echo "1. Post a job"
echo "2. Accept job"
echo "3. Submit work"
echo "4. Approve work"
echo "5. View job details"
echo "6. Create profile"
echo "7. View profile"
echo "8. Submit rating"
echo ""
read -p "Choice (1-8): " choice

case $choice in
  1)
    read -p "Job title: " title
    read -p "Amount (STX): " stx
    amount=$((stx * 1000000))
    read -p "Deadline (blocks): " deadline
    
    stx call $CONTRACT_ADDRESS escrow post-job \
      "\"$title\"" "u$amount" "u$deadline" \
      --network $NETWORK
    ;;
    
  2)
    read -p "Job ID: " jobid
    stx call $CONTRACT_ADDRESS escrow accept-job "u$jobid" --network $NETWORK
    ;;
    
  3)
    read -p "Job ID: " jobid
    stx call $CONTRACT_ADDRESS escrow submit-work "u$jobid" --network $NETWORK
    ;;
    
  4)
    read -p "Job ID: " jobid
    stx call $CONTRACT_ADDRESS escrow approve-work "u$jobid" --network $NETWORK
    ;;
    
  5)
    read -p "Job ID: " jobid
    stx call $CONTRACT_ADDRESS escrow get-job "u$jobid" --network $NETWORK --readonly
    ;;
    
  6)
    read -p "Username: " username
    read -p "Bio: " bio
    read -p "Skills: " skills
    
    stx call $CONTRACT_ADDRESS reputation create-profile \
      "\"$username\"" "\"$bio\"" "\"$skills\"" \
      --network $NETWORK
    ;;
    
  7)
    read -p "Address: " addr
    stx call $CONTRACT_ADDRESS reputation get-profile "'$addr" --network $NETWORK --readonly
    ;;
    
  8)
    read -p "Job ID: " jobid
    read -p "Professional address: " prof
    read -p "Rating (1-5): " rating
    read -p "Comment: " comment
    
    stx call $CONTRACT_ADDRESS reputation submit-rating \
      "u$jobid" "'$prof" "u$rating" "\"$comment\"" \
      --network $NETWORK
    ;;
    
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac
