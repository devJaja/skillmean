import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Client can post a job and lock funds in escrow",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const client = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'escrow',
        'post-job',
        [
          types.ascii("Build a website"),
          types.uint(1000000), // 1 STX
          types.uint(150) // deadline
        ],
        client.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "Professional can accept a job",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const client = accounts.get('wallet_1')!;
    const professional = accounts.get('wallet_2')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'escrow',
        'post-job',
        [types.ascii("Design logo"), types.uint(500000), types.uint(100)],
        client.address
      ),
      Tx.contractCall(
        'escrow',
        'accept-job',
        [types.uint(1)],
        professional.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Professional can submit work and client can approve",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const client = accounts.get('wallet_1')!;
    const professional = accounts.get('wallet_2')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'escrow',
        'post-job',
        [types.ascii("Write article"), types.uint(300000), types.uint(100)],
        client.address
      ),
      Tx.contractCall(
        'escrow',
        'accept-job',
        [types.uint(1)],
        professional.address
      ),
      Tx.contractCall(
        'escrow',
        'submit-work',
        [types.uint(1)],
        professional.address
      ),
      Tx.contractCall(
        'escrow',
        'approve-work',
        [types.uint(1)],
        client.address
      )
    ]);
    
    assertEquals(block.receipts.length, 4);
    block.receipts[3].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Cannot accept already accepted job",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const client = accounts.get('wallet_1')!;
    const professional1 = accounts.get('wallet_2')!;
    const professional2 = accounts.get('wallet_3')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'escrow',
        'post-job',
        [types.ascii("Test job"), types.uint(100000), types.uint(50)],
        client.address
      ),
      Tx.contractCall(
        'escrow',
        'accept-job',
        [types.uint(1)],
        professional1.address
      ),
      Tx.contractCall(
        'escrow',
        'accept-job',
        [types.uint(1)],
        professional2.address
      )
    ]);
    
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(104); // err-already-accepted
  },
});

Clarinet.test({
  name: "Client can cancel open job",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const client = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'escrow',
        'post-job',
        [types.ascii("Cancel test"), types.uint(200000), types.uint(100)],
        client.address
      ),
      Tx.contractCall(
        'escrow',
        'cancel-job',
        [types.uint(1)],
        client.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Can raise dispute on submitted work",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const client = accounts.get('wallet_1')!;
    const professional = accounts.get('wallet_2')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'escrow',
        'post-job',
        [types.ascii("Dispute test"), types.uint(400000), types.uint(100)],
        client.address
      ),
      Tx.contractCall(
        'escrow',
        'accept-job',
        [types.uint(1)],
        professional.address
      ),
      Tx.contractCall(
        'escrow',
        'submit-work',
        [types.uint(1)],
        professional.address
      ),
      Tx.contractCall(
        'escrow',
        'raise-dispute',
        [types.uint(1)],
        client.address
      )
    ]);
    
    assertEquals(block.receipts.length, 4);
    block.receipts[3].result.expectOk().expectBool(true);
  },
});
