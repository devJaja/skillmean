#!/usr/bin/env python3
import requests
import json
import sys

CONTRACT_ADDRESS = "SP19PS42C7R7BR4VCX2YN8KPHXSB0ZC19K6PFEKTC"
API_URL = "https://api.hiro.so"

def get_job(job_id):
    url = f"{API_URL}/v2/contracts/call-read/{CONTRACT_ADDRESS}/escrow/get-job"
    data = {
        "sender": CONTRACT_ADDRESS,
        "arguments": [f"0x{job_id:032x}"]
    }
    response = requests.post(url, json=data)
    return response.json()

def get_profile(address):
    url = f"{API_URL}/v2/contracts/call-read/{CONTRACT_ADDRESS}/reputation/get-profile"
    data = {
        "sender": CONTRACT_ADDRESS,
        "arguments": [f"0x{address}"]
    }
    response = requests.post(url, json=data)
    return response.json()

def get_contract_info():
    url = f"{API_URL}/v2/contracts/interface/{CONTRACT_ADDRESS}/escrow"
    response = requests.get(url)
    return response.json()

def get_transactions():
    url = f"{API_URL}/extended/v1/address/{CONTRACT_ADDRESS}/transactions"
    response = requests.get(url)
    return response.json()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 api-query.py job <jobId>")
        print("  python3 api-query.py profile <address>")
        print("  python3 api-query.py info")
        print("  python3 api-query.py txs")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "job":
        result = get_job(int(sys.argv[2]))
        print(json.dumps(result, indent=2))
    elif command == "profile":
        result = get_profile(sys.argv[2])
        print(json.dumps(result, indent=2))
    elif command == "info":
        result = get_contract_info()
        print(json.dumps(result, indent=2))
    elif command == "txs":
        result = get_transactions()
        print(json.dumps(result, indent=2))
    else:
        print(f"Unknown command: {command}")
