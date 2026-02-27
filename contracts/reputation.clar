;; Skills-Bridge Reputation Contract
;; On-chain skill profiles and ratings

;; Constants
(define-constant err-not-authorized (err u200))
(define-constant err-profile-exists (err u201))
(define-constant err-profile-not-found (err u202))
(define-constant err-invalid-rating (err u203))
(define-constant err-job-not-completed (err u204))

;; Data structures
(define-map profiles
  principal
  {
    username: (string-ascii 50),
    bio: (string-ascii 500),
    skills: (string-ascii 200),
    total-jobs: uint,
    completed-jobs: uint,
    total-earned: uint,
    rating-sum: uint,
    rating-count: uint,
    created-at: uint
  }
)

(define-map ratings
  { job-id: uint, rater: principal }
  {
    rating: uint,
    comment: (string-ascii 200),
    timestamp: uint
  }
)

;; Read-only functions
(define-read-only (get-profile (user principal))
  (map-get? profiles user)
)

(define-read-only (get-rating (job-id uint) (rater principal))
  (map-get? ratings { job-id: job-id, rater: rater })
)

(define-read-only (get-average-rating (user principal))
  (match (map-get? profiles user)
    profile
      (if (> (get rating-count profile) u0)
        (ok (/ (get rating-sum profile) (get rating-count profile)))
        (ok u0)
      )
    (err err-profile-not-found)
  )
)

(define-read-only (get-completion-rate (user principal))
  (match (map-get? profiles user)
    profile
      (if (> (get total-jobs profile) u0)
        (ok (/ (* (get completed-jobs profile) u100) (get total-jobs profile)))
        (ok u0)
      )
    (err err-profile-not-found)
  )
)

;; Public functions

;; Create professional profile
(define-public (create-profile (username (string-ascii 50)) (bio (string-ascii 500)) (skills (string-ascii 200)))
  (begin
    (asserts! (is-none (map-get? profiles tx-sender)) err-profile-exists)
    
    (map-set profiles tx-sender {
      username: username,
      bio: bio,
      skills: skills,
      total-jobs: u0,
      completed-jobs: u0,
      total-earned: u0,
      rating-sum: u0,
      rating-count: u0,
      created-at: block-height
    })
    (ok true)
  )
)

;; Update profile
(define-public (update-profile (bio (string-ascii 500)) (skills (string-ascii 200)))
  (let
    (
      (profile (unwrap! (map-get? profiles tx-sender) err-profile-not-found))
    )
    (map-set profiles tx-sender (merge profile {
      bio: bio,
      skills: skills
    }))
    (ok true)
  )
)

;; Record job completion (called by escrow contract)
(define-public (record-job-completion (professional principal) (amount uint))
  (let
    (
      (profile (unwrap! (map-get? profiles professional) err-profile-not-found))
    )
    (map-set profiles professional (merge profile {
      total-jobs: (+ (get total-jobs profile) u1),
      completed-jobs: (+ (get completed-jobs profile) u1),
      total-earned: (+ (get total-earned profile) amount)
    }))
    (ok true)
  )
)

;; Submit rating (client rates professional after job completion)
(define-public (submit-rating (job-id uint) (professional principal) (rating uint) (comment (string-ascii 200)))
  (let
    (
      (profile (unwrap! (map-get? profiles professional) err-profile-not-found))
    )
    (asserts! (and (>= rating u1) (<= rating u5)) err-invalid-rating)
    
    ;; Store rating
    (map-set ratings 
      { job-id: job-id, rater: tx-sender }
      {
        rating: rating,
        comment: comment,
        timestamp: block-height
      }
    )
    
    ;; Update professional's rating
    (map-set profiles professional (merge profile {
      rating-sum: (+ (get rating-sum profile) rating),
      rating-count: (+ (get rating-count profile) u1)
    }))
    
    (ok true)
  )
)
