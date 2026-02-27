;; Skills-Bridge Escrow Contract
;; Handles job posting, fund locking, and payment release

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u100))
(define-constant err-job-not-found (err u101))
(define-constant err-invalid-status (err u102))
(define-constant err-insufficient-funds (err u103))
(define-constant err-already-accepted (err u104))

;; Data Variables
(define-data-var job-nonce uint u0)
(define-data-var platform-fee-percent uint u3) ;; 3% platform fee

;; Job Status
(define-constant STATUS-OPEN u1)
(define-constant STATUS-ACCEPTED u2)
(define-constant STATUS-SUBMITTED u3)
(define-constant STATUS-COMPLETED u4)
(define-constant STATUS-DISPUTED u5)
(define-constant STATUS-CANCELLED u6)

;; Job Data Structure
(define-map jobs
  uint
  {
    client: principal,
    professional: (optional principal),
    title: (string-ascii 100),
    amount: uint,
    status: uint,
    created-at: uint,
    deadline: uint
  }
)

;; Escrow Balance
(define-map escrow-balance uint uint)

;; Read-only functions
(define-read-only (get-job (job-id uint))
  (map-get? jobs job-id)
)

(define-read-only (get-escrow-balance (job-id uint))
  (default-to u0 (map-get? escrow-balance job-id))
)

(define-read-only (get-platform-fee (amount uint))
  (/ (* amount (var-get platform-fee-percent)) u100)
)

;; Public functions

;; Post a new job and lock funds in escrow
(define-public (post-job (title (string-ascii 100)) (amount uint) (deadline uint))
  (let
    (
      (job-id (+ (var-get job-nonce) u1))
      (fee (get-platform-fee amount))
      (total (+ amount fee))
    )
    (asserts! (> amount u0) err-insufficient-funds)
    (try! (stx-transfer? total tx-sender (as-contract tx-sender)))
    
    (map-set jobs job-id {
      client: tx-sender,
      professional: none,
      title: title,
      amount: amount,
      status: STATUS-OPEN,
      created-at: block-height,
      deadline: deadline
    })
    
    (map-set escrow-balance job-id amount)
    (var-set job-nonce job-id)
    (ok job-id)
  )
)

;; Professional accepts a job
(define-public (accept-job (job-id uint))
  (let
    (
      (job (unwrap! (map-get? jobs job-id) err-job-not-found))
    )
    (asserts! (is-eq (get status job) STATUS-OPEN) err-invalid-status)
    (asserts! (is-none (get professional job)) err-already-accepted)
    
    (map-set jobs job-id (merge job {
      professional: (some tx-sender),
      status: STATUS-ACCEPTED
    }))
    (ok true)
  )
)

;; Professional submits completed work
(define-public (submit-work (job-id uint))
  (let
    (
      (job (unwrap! (map-get? jobs job-id) err-job-not-found))
    )
    (asserts! (is-eq (some tx-sender) (get professional job)) err-not-authorized)
    (asserts! (is-eq (get status job) STATUS-ACCEPTED) err-invalid-status)
    
    (map-set jobs job-id (merge job { status: STATUS-SUBMITTED }))
    (ok true)
  )
)

;; Client approves work and releases payment
(define-public (approve-work (job-id uint))
  (let
    (
      (job (unwrap! (map-get? jobs job-id) err-job-not-found))
      (amount (get-escrow-balance job-id))
      (professional (unwrap! (get professional job) err-not-authorized))
    )
    (asserts! (is-eq tx-sender (get client job)) err-not-authorized)
    (asserts! (is-eq (get status job) STATUS-SUBMITTED) err-invalid-status)
    
    ;; Release funds from escrow to professional
    (try! (as-contract (stx-transfer? amount tx-sender professional)))
    
    (map-set jobs job-id (merge job { status: STATUS-COMPLETED }))
    (map-set escrow-balance job-id u0)
    (ok true)
  )
)

;; Client cancels job (only if not accepted)
(define-public (cancel-job (job-id uint))
  (let
    (
      (job (unwrap! (map-get? jobs job-id) err-job-not-found))
      (amount (get-escrow-balance job-id))
      (fee (get-platform-fee amount))
    )
    (asserts! (is-eq tx-sender (get client job)) err-not-authorized)
    (asserts! (is-eq (get status job) STATUS-OPEN) err-invalid-status)
    
    ;; Refund client (minus platform fee for cancellation)
    (try! (as-contract (stx-transfer? amount tx-sender (get client job))))
    
    (map-set jobs job-id (merge job { status: STATUS-CANCELLED }))
    (map-set escrow-balance job-id u0)
    (ok true)
  )
)

;; Initiate dispute
(define-public (raise-dispute (job-id uint))
  (let
    (
      (job (unwrap! (map-get? jobs job-id) err-job-not-found))
    )
    (asserts! 
      (or 
        (is-eq tx-sender (get client job))
        (is-eq (some tx-sender) (get professional job))
      )
      err-not-authorized
    )
    (asserts! (is-eq (get status job) STATUS-SUBMITTED) err-invalid-status)
    
    (map-set jobs job-id (merge job { status: STATUS-DISPUTED }))
    (ok true)
  )
)
