;; Decentralized Auction dApp Smart Contract for Stacks
;; Implements NFT-based item listings with bidding mechanics

;; Define NFT trait for auction items
(define-non-fungible-token auction-item uint)

;; Contract owner
(define-constant contract-owner tx-sender)

;; Error codes
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-bid (err u103))
(define-constant err-auction-ended (err u104))
(define-constant err-auction-active (err u105))
(define-constant err-self-bid (err u106))
(define-constant err-bid-and-run (err u107))
(define-constant err-insufficient-payment (err u108))
(define-constant err-already-claimed (err u109))
(define-constant err-auction-not-ended (err u110))
(define-constant err-invalid-input (err u111))
(define-constant err-invalid-duration (err u112))
(define-constant err-invalid-price (err u113))

;; Data variables
(define-data-var next-item-id uint u1)
(define-data-var platform-fee-rate uint u250) ;; 2.5% fee (250/10000)

;; Auction structure
(define-map auctions uint {
    seller: principal,
    title: (string-ascii 100),
    description: (string-ascii 500),
    starting-price: uint,
    current-bid: uint,
    highest-bidder: (optional principal),
    end-block: uint,
    is-active: bool,
    item-claimed: bool,
    payment-claimed: bool
})

;; Track user bids for each auction
(define-map auction-bids {auction-id: uint, bidder: principal} uint)

;; Track user's active bids to prevent bid-and-run
(define-map user-active-bids principal (list 50 uint))

;; Platform earnings
(define-data-var platform-earnings uint u0)

;; === INPUT VALIDATION FUNCTIONS ===

;; Validate string inputs are not empty and within bounds
(define-private (is-valid-string (input (string-ascii 100)))
    (and (> (len input) u0) (<= (len input) u100))
)

(define-private (is-valid-description (input (string-ascii 500)))
    (and (> (len input) u0) (<= (len input) u500))
)

;; Validate price inputs
(define-private (is-valid-price (price uint))
    (and (> price u0) (<= price u1000000000000)) ;; Max ~1M STX in microSTX
)

;; Validate duration inputs
(define-private (is-valid-duration (duration uint))
    (and (>= duration u144) (<= duration u1051200)) ;; Min 1 day, max ~1 year in blocks
)

;; Validate auction ID exists and is within bounds
(define-private (is-valid-auction-id (auction-id uint))
    (and (> auction-id u0) (< auction-id (var-get next-item-id)))
)

;; Get current block height
(define-read-only (get-block-height)
    stacks-block-height
)

;; Check if auction has ended
(define-read-only (has-auction-ended (auction-id uint))
    (match (map-get? auctions auction-id)
        auction (>= stacks-block-height (get end-block auction))
        false
    )
)

;; Get user's active bids
(define-read-only (get-user-active-bids (user principal))
    (default-to (list) (map-get? user-active-bids user))
)

;; Remove auction from user's active bids
(define-private (remove-from-active-bids (user principal) (auction-id uint))
    (let ((current-bids (get-user-active-bids user)))
        (var-set current-auction-to-remove auction-id)
        (let ((filtered-bids (filter not-target-auction current-bids)))
            (map-set user-active-bids user filtered-bids)
        )
        true
    )
)

;; Helper function for filtering out target auction
(define-private (not-target-auction (id uint))
    (not (is-eq id (var-get current-auction-to-remove)))
)

;; Temporary variable to store auction ID for filtering
(define-data-var current-auction-to-remove uint u0)



;; === MAIN FUNCTIONS ===

;; Create new auction (mints NFT)
(define-public (create-auction (title (string-ascii 100)) (description (string-ascii 500)) (starting-price uint) (duration-blocks uint))
    (begin
        ;; Input validation
        (asserts! (is-valid-string title) err-invalid-input)
        (asserts! (is-valid-description description) err-invalid-input)
        (asserts! (is-valid-price starting-price) err-invalid-price)
        (asserts! (is-valid-duration duration-blocks) err-invalid-duration)
        
        (let ((item-id (var-get next-item-id))
              (end-block (+ stacks-block-height duration-blocks)))
            
            ;; Additional safety check for overflow
            (asserts! (> end-block stacks-block-height) err-invalid-duration)
            
            ;; Mint NFT to contract (will be transferred to winner)
            (try! (nft-mint? auction-item item-id (as-contract tx-sender)))
            
            ;; Store auction data
            (map-set auctions item-id {
                seller: tx-sender,
                title: title,
                description: description,
                starting-price: starting-price,
                current-bid: starting-price,
                highest-bidder: none,
                end-block: end-block,
                is-active: true,
                item-claimed: false,
                payment-claimed: false
            })
            
            ;; Increment next item ID
            (var-set next-item-id (+ item-id u1))
            
            (ok item-id)
        )
    )
)

;; Place bid on auction
(define-public (place-bid (auction-id uint) (bid-amount uint))
    (begin
        ;; Input validation
        (asserts! (is-valid-auction-id auction-id) err-not-found)
        (asserts! (is-valid-price bid-amount) err-invalid-bid)
        
        (let ((auction-data (unwrap! (map-get? auctions auction-id) err-not-found))
              (user-bids (get-user-active-bids tx-sender)))
            
            ;; Check if auction exists and is active
            (asserts! (get is-active auction-data) err-auction-ended)
            
            ;; Check if auction hasn't ended
            (asserts! (< stacks-block-height (get end-block auction-data)) err-auction-ended)
            
            ;; Prevent seller from bidding on own auction
            (asserts! (not (is-eq tx-sender (get seller auction-data))) err-self-bid)
            
            ;; Prevent bid-and-run: user cannot have more than 3 active bids
            (asserts! (< (len user-bids) u3) err-bid-and-run)
            
            ;; Check if bid is higher than current bid (with minimum increment)
            (let ((min-bid (+ (get current-bid auction-data) u1000000))) ;; Min 1 STX increment
                (asserts! (>= bid-amount min-bid) err-invalid-bid)
            )
            
            ;; Ensure user has sufficient balance
            (asserts! (>= (stx-get-balance tx-sender) bid-amount) err-insufficient-payment)
            
            ;; Transfer STX from bidder to contract
            (try! (stx-transfer? bid-amount tx-sender (as-contract tx-sender)))
            
            ;; Refund previous highest bidder if exists
            (match (get highest-bidder auction-data)
                prev-bidder (try! (as-contract (stx-transfer? 
                                    (get current-bid auction-data) 
                                    tx-sender 
                                    prev-bidder)))
                true
            )
            
            ;; Update auction with new highest bid
            (map-set auctions auction-id (merge auction-data {
                current-bid: bid-amount,
                highest-bidder: (some tx-sender)
            }))
            
            ;; Track this bid for the user
            (map-set auction-bids {auction-id: auction-id, bidder: tx-sender} bid-amount)
            
            ;; Add to user's active bids
            (map-set user-active-bids tx-sender 
                (unwrap! (as-max-len? (append user-bids auction-id) u50) err-bid-and-run))
            
            (ok true)
        )
    )
)

;; End auction (can be called by anyone after end-block)
(define-public (end-auction (auction-id uint))
    (begin
        ;; Input validation
        (asserts! (is-valid-auction-id auction-id) err-not-found)
        
        (let ((auction-data (unwrap! (map-get? auctions auction-id) err-not-found)))
            
            ;; Check if auction can be ended
            (asserts! (get is-active auction-data) err-auction-ended)
            (asserts! (>= stacks-block-height (get end-block auction-data)) err-auction-not-ended)
            
            ;; Mark auction as ended
            (map-set auctions auction-id (merge auction-data {
                is-active: false
            }))
            
            ;; Remove auction from winner's active bids if there's a winner
            (match (get highest-bidder auction-data)
                winner (remove-from-active-bids winner auction-id)
                true
            )
            
            (ok true)
        )
    )
)

;; Claim NFT (winner claims the item)
(define-public (claim-item (auction-id uint))
    (begin
        ;; Input validation
        (asserts! (is-valid-auction-id auction-id) err-not-found)
        
        (let ((auction-data (unwrap! (map-get? auctions auction-id) err-not-found)))
            
            ;; Check if auction has ended
            (asserts! (not (get is-active auction-data)) err-auction-active)
            (asserts! (not (get item-claimed auction-data)) err-already-claimed)
            
            ;; Check if caller is the winner
            (asserts! (is-eq (some tx-sender) (get highest-bidder auction-data)) err-unauthorized)
            
            ;; Transfer NFT to winner
            (try! (nft-transfer? auction-item auction-id (as-contract tx-sender) tx-sender))
            
            ;; Mark item as claimed
            (map-set auctions auction-id (merge auction-data {
                item-claimed: true
            }))
            
            (ok true)
        )
    )
)

;; Claim payment (seller claims the payment)
(define-public (claim-payment (auction-id uint))
    (begin
        ;; Input validation
        (asserts! (is-valid-auction-id auction-id) err-not-found)
        
        (let ((auction-data (unwrap! (map-get? auctions auction-id) err-not-found))
              (payment-amount (get current-bid auction-data))
              (platform-fee (/ (* payment-amount (var-get platform-fee-rate)) u10000))
              (seller-amount (- payment-amount platform-fee)))
            
            ;; Check if auction has ended and payment not claimed
            (asserts! (not (get is-active auction-data)) err-auction-active)
            (asserts! (not (get payment-claimed auction-data)) err-already-claimed)
            (asserts! (is-eq tx-sender (get seller auction-data)) err-unauthorized)
            (asserts! (is-some (get highest-bidder auction-data)) err-not-found)
            
            ;; Additional safety checks
            (asserts! (> payment-amount u0) err-invalid-bid)
            (asserts! (>= payment-amount platform-fee) err-invalid-bid)
            
            ;; Transfer payment to seller (minus platform fee)
            (try! (as-contract (stx-transfer? seller-amount tx-sender (get seller auction-data))))
            
            ;; Add platform fee to earnings
            (var-set platform-earnings (+ (var-get platform-earnings) platform-fee))
            
            ;; Mark payment as claimed
            (map-set auctions auction-id (merge auction-data {
                payment-claimed: true
            }))
            
            (ok seller-amount)
        )
    )
)

;; === READ-ONLY FUNCTIONS ===

;; Get auction details
(define-read-only (get-auction (auction-id uint))
    (map-get? auctions auction-id)
)

;; Get user's bid for specific auction
(define-read-only (get-user-bid (auction-id uint) (user principal))
    (map-get? auction-bids {auction-id: auction-id, bidder: user})
)

;; Get NFT owner
(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? auction-item token-id))
)

;; Get NFT URI (can be implemented to return metadata)
(define-read-only (get-token-uri (token-id uint))
    (ok (some "https://your-metadata-api.com/token/{id}"))
)

;; Get platform earnings
(define-read-only (get-platform-earnings)
    (var-get platform-earnings)
)

;; Get next item ID (total number of auctions created + 1)
(define-read-only (get-next-item-id)
    (var-get next-item-id)
)

;; === ADMIN FUNCTIONS ===

;; Withdraw platform earnings (owner only)
(define-public (withdraw-platform-earnings)
    (let ((earnings (var-get platform-earnings)))
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (try! (as-contract (stx-transfer? earnings tx-sender contract-owner)))
        (var-set platform-earnings u0)
        (ok earnings)
    )
)

;; Update platform fee rate (owner only)
(define-public (set-platform-fee-rate (new-rate uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (<= new-rate u1000) err-invalid-bid) ;; Max 10% fee
        (var-set platform-fee-rate new-rate)
        (ok true)
    )
)