import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Professional can create profile",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const professional = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'reputation',
        'create-profile',
        [
          types.ascii("johndoe"),
          types.ascii("Full-stack developer with 5 years experience"),
          types.ascii("JavaScript, React, Node.js, Solidity")
        ],
        professional.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Cannot create duplicate profile",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const professional = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'reputation',
        'create-profile',
        [
          types.ascii("johndoe"),
          types.ascii("Developer"),
          types.ascii("JavaScript")
        ],
        professional.address
      ),
      Tx.contractCall(
        'reputation',
        'create-profile',
        [
          types.ascii("johndoe2"),
          types.ascii("Developer"),
          types.ascii("Python")
        ],
        professional.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(201); // err-profile-exists
  },
});

Clarinet.test({
  name: "Can update existing profile",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const professional = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'reputation',
        'create-profile',
        [
          types.ascii("johndoe"),
          types.ascii("Developer"),
          types.ascii("JavaScript")
        ],
        professional.address
      ),
      Tx.contractCall(
        'reputation',
        'update-profile',
        [
          types.ascii("Senior Full-stack Developer"),
          types.ascii("JavaScript, TypeScript, React, Node.js")
        ],
        professional.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Can submit rating for professional",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const professional = accounts.get('wallet_1')!;
    const client = accounts.get('wallet_2')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'reputation',
        'create-profile',
        [
          types.ascii("johndoe"),
          types.ascii("Developer"),
          types.ascii("JavaScript")
        ],
        professional.address
      ),
      Tx.contractCall(
        'reputation',
        'submit-rating',
        [
          types.uint(1), // job-id
          types.principal(professional.address),
          types.uint(5), // 5-star rating
          types.ascii("Excellent work, delivered on time!")
        ],
        client.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Rating must be between 1 and 5",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const professional = accounts.get('wallet_1')!;
    const client = accounts.get('wallet_2')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'reputation',
        'create-profile',
        [
          types.ascii("johndoe"),
          types.ascii("Developer"),
          types.ascii("JavaScript")
        ],
        professional.address
      ),
      Tx.contractCall(
        'reputation',
        'submit-rating',
        [
          types.uint(1),
          types.principal(professional.address),
          types.uint(6), // Invalid rating
          types.ascii("Test")
        ],
        client.address
      )
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectErr().expectUint(203); // err-invalid-rating
  },
});

Clarinet.test({
  name: "Can calculate average rating correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const professional = accounts.get('wallet_1')!;
    const client1 = accounts.get('wallet_2')!;
    const client2 = accounts.get('wallet_3')!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'reputation',
        'create-profile',
        [
          types.ascii("johndoe"),
          types.ascii("Developer"),
          types.ascii("JavaScript")
        ],
        professional.address
      ),
      Tx.contractCall(
        'reputation',
        'submit-rating',
        [types.uint(1), types.principal(professional.address), types.uint(5), types.ascii("Great!")],
        client1.address
      ),
      Tx.contractCall(
        'reputation',
        'submit-rating',
        [types.uint(2), types.principal(professional.address), types.uint(4), types.ascii("Good")],
        client2.address
      )
    ]);
    
    // Average should be (5 + 4) / 2 = 4.5, but integer division gives 4
    let avgRating = chain.callReadOnlyFn(
      'reputation',
      'get-average-rating',
      [types.principal(professional.address)],
      professional.address
    );
    
    avgRating.result.expectOk().expectUint(4);
  },
});
