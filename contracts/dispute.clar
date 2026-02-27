;; Skills-Bridge Dispute Resolution Contract
;; Basic arbitration system for disputed jobs

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u300))
(define-constant err-dispute-not-found (err u301))
(define-constant err-already-resolved (err u302))
(define-constant err-invalid-decision (err u303))

;; Dispute outcomes
(define-constant OUTCOME-PENDING u0)
(define-constant OUTCOME-CLIENT-WINS u1)
(define-constant OUTCOME-PROFESSIONAL-WINS u2)
(define-constant OUTCOME-SPLIT u3)

;; Data structures
(define-map disputes
  uint ;; job-id
  {
    client: principal,
    professional: principal,
    client-evidence: (string-ascii 500),
    professional-evidence: (string-ascii 500),
    outcome: uint,
    resolved-at: (optional uint),
    arbitrator: (optional principal)
  }
)

(define-map arbitrators principal bool)

;; Initialize contract owner as first arbitrator
(map-set arbitrators contract-owner true)

;; Read-only functions
(define-read-only (get-dispute (job-id uint))
  (map-get? disputes job-id)
)

(define-read-only (is-arbitrator (user principal))
  (default-to false (map-get? arbitrators user))
)

;; Public functions

;; Create dispute (called when job is disputed)
(define-public (create-dispute (job-id uint) (client principal) (professional principal) (evidence (string-ascii 500)))
  (begin
    (asserts! 
      (or (is-eq tx-sender client) (is-eq tx-sender professional))
      err-not-authorized
    )
    
    (map-set disputes job-id {
      client: client,
      professional: professional,
      client-evidence: (if (is-eq tx-sender client) evidence ""),
      professional-evidence: (if (is-eq tx-sender professional) evidence ""),
      outcome: OUTCOME-PENDING,
      resolved-at: none,
      arbitrator: none
    })
    (ok true)
  )
)

;; Submit evidence
(define-public (submit-evidence (job-id uint) (evidence (string-ascii 500)))
  (let
    (
      (dispute (unwrap! (map-get? disputes job-id) err-dispute-not-found))
    )
    (asserts! 
      (or 
        (is-eq tx-sender (get client dispute))
        (is-eq tx-sender (get professional dispute))
      )
      err-not-authorized
    )
    (asserts! (is-eq (get outcome dispute) OUTCOME-PENDING) err-already-resolved)
    
    (if (is-eq tx-sender (get client dispute))
      (map-set disputes job-id (merge dispute { client-evidence: evidence }))
      (map-set disputes job-id (merge dispute { professional-evidence: evidence }))
    )
    (ok true)
  )
)

;; Resolve dispute (arbitrator only)
(define-public (resolve-dispute (job-id uint) (outcome uint))
  (let
    (
      (dispute (unwrap! (map-get? disputes job-id) err-dispute-not-found))
    )
    (asserts! (is-arbitrator tx-sender) err-not-authorized)
    (asserts! (is-eq (get outcome dispute) OUTCOME-PENDING) err-already-resolved)
    (asserts! 
      (or 
        (is-eq outcome OUTCOME-CLIENT-WINS)
        (is-eq outcome OUTCOME-PROFESSIONAL-WINS)
        (is-eq outcome OUTCOME-SPLIT)
      )
      err-invalid-decision
    )
    
    (map-set disputes job-id (merge dispute {
      outcome: outcome,
      resolved-at: (some block-height),
      arbitrator: (some tx-sender)
    }))
    (ok true)
  )
)

;; Add arbitrator (owner only)
(define-public (add-arbitrator (arbitrator principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (map-set arbitrators arbitrator true)
    (ok true)
  )
)

;; Remove arbitrator (owner only)
(define-public (remove-arbitrator (arbitrator principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (map-set arbitrators arbitrator false)
    (ok true)
  )
)
