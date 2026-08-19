# Wishlist Stock Tracker

> An e-commerce wishlist and stock monitoring system.

**[📖 Project README](README.md)** · **[👥 Team Work Division](TEAM_WORK.md)**

---

A full-stack web application built for **Simulated Work — Semester 3, Sprint 1, Team 05**.

## Team

- **Campus:** JECRC
- **Squad:** 124
- **Team:** 05

### Team Members

- Mohit Singh
- Virendra Singh
- Kumkum Kushwah

### Mentor

- **Technical Mentor:** Siddesh Gore

---

## Problem Statement

> Flipkart wants a wishlist that auto-checks stock status every 30 seconds for wishlisted items only. Moving an item to cart removes it from wishlist optimistically, and the cart should not accept out-of-stock items.

## Problem We Are Solving

Users need to know whether products in their wishlist are still available without manually refreshing the page.

The system should:

1. Allow users to maintain a wishlist.
2. Check stock status of wishlist items every 30 seconds.
3. Check only products that are currently wishlisted.
4. Update stock availability in the UI.
5. Remove an item from the wishlist immediately when the user moves it to the cart.
6. Validate stock again on the server before adding an item to the cart.
7. Prevent out-of-stock products from being added to the cart.

---

## Target Users

The primary user is an **e-commerce customer** who:

- Saves products for later.
- Wants to know when a wishlisted product becomes unavailable.
- Moves products from their wishlist to their cart.
- Expects the cart to contain only currently available products.

---

## Core User Flow

```text
                    User
                     │
                     ▼
              Product Catalogue
                     │
              Add to Wishlist
                     │
                     ▼
                  Wishlist
                     │
                     │
             Every 30 seconds
                     │
                     ▼
             Check wishlist
             product stock only
                     │
                     ▼
              Update UI status
                     │
                     │
              Add to Cart
                     │
                     ▼
          Optimistically remove
             from wishlist
                     │
                     ▼
             Server-side check
                current stock
                 │         │
                 ▼         ▼
             In Stock   Out of Stock
                 │         │
                 ▼         ▼
              Add to     Reject
               Cart      Request

---
```

## Functional Requirements

### 1. Product Catalogue

The application should provide a product catalogue where users can:

- View available products.
- View product name, price, image and stock status.
- Add products to their wishlist.
- Add products to their cart where stock is available.

---

### 2. Wishlist

Users should be able to:

- Add a product to their wishlist.
- Remove a product from their wishlist.
- View all their wishlisted products.
- See the latest known stock status of wishlisted products.
- Move a wishlisted product to the cart.

The wishlist should belong to the authenticated user.

---

### 3. Automatic Stock Checking

The application must automatically check stock for wishlist products every **30 seconds**.

Important rules:

- Only wishlist products should be checked.
- Products that are not wishlisted should not be polled.
- The latest stock status should be reflected in the UI.
- Polling should stop when the wishlist is no longer active.

Example:

```text
User Wishlist
      │
      ├── Product A
      ├── Product B
      └── Product C

Every 30 seconds

      │
      ▼

Check:
├── Product A ✅
├── Product B ✅
└── Product C ✅

Do NOT check:
├── Product D ❌
├── Product E ❌
└── Product F ❌
```

# Product Requirements Document (PRD)

## Team 05 — Wishlist Stock Monitoring System

**Campus:** JECRC  
**Squad:** 124  
**Sprint:** 1  
**Track:** Full Stack

---

# 1. Problem Statement

Flipkart wants a wishlist that automatically checks stock status every 30 seconds for wishlisted items only.

When a user moves an item from their wishlist to their cart, the item should be removed from the wishlist optimistically.

However, the cart must never accept an out-of-stock product.

The system therefore needs to handle two potentially different states:

- The stock status shown to the frontend.
- The actual stock status validated by the backend.

The backend must always be the final source of truth.

---

# 2. Product Goal

Build a full-stack e-commerce application where users can:

1. Browse products.
2. Add products to a wishlist.
3. View their wishlist.
4. Automatically monitor wishlist stock every 30 seconds.
5. Move wishlist products to the cart.
6. Receive an immediate UI update through optimistic removal.
7. Have the backend validate stock before adding the product to the cart.
8. Restore the product to the wishlist if the cart operation fails.

---

# 3. Target User

The primary user is an e-commerce customer who:

- Saves products for later.
- Wants to know whether saved products are still available.
- Wants quick movement from wishlist to cart.
- Expects the cart to contain only available products.

---

# 4. User Stories

## Wishlist

### US-01 — Add Product

**As a user,**  
I want to add a product to my wishlist  
**so that** I can save it for later.

### Acceptance Criteria

- User can click "Add to Wishlist".
- Product appears in the wishlist.
- The same product cannot be added twice.
- Wishlist belongs to the authenticated user.

---

### US-02 — Remove Product

**As a user,**  
I want to remove a product from my wishlist  
**so that** I no longer track its stock.

### Acceptance Criteria

- User can remove a product.
- Product disappears from the wishlist.
- The product is no longer included in stock polling.

---

### US-03 — View Wishlist

**As a user,**  
I want to see all my wishlisted products  
**so that** I can manage products I want to purchase later.

### Acceptance Criteria

- Wishlist displays all saved products.
- Product information is displayed.
- Current known stock status is displayed.
- User can move available products to the cart.

---

# 5. Stock Monitoring

## US-04 — Automatic Stock Checking

**As a user,**  
I want my wishlist products to be checked automatically  
**so that** I know when their availability changes.

### Acceptance Criteria

- Stock is checked every 30 seconds.
- Only wishlisted products are checked.
- Non-wishlisted products are not included.
- UI updates when stock changes.
- Polling stops when the wishlist page is inactive/unmounted.

---

## US-05 — Out-of-Stock Detection

**As a user,**  
I want to know when a wishlisted product becomes unavailable  
**so that** I don't attempt to purchase an unavailable product.

### Acceptance Criteria

- Product status changes to "Out of Stock".
- Add-to-cart action is disabled or clearly rejected.
- Product remains in the wishlist unless the user removes it.

---

# 6. Cart

## US-06 — Move Wishlist Product to Cart

**As a user,**  
I want to move a wishlist product to my cart  
**so that** I can purchase it.

### Acceptance Criteria

- Product is immediately removed from the wishlist UI.
- Cart request is sent to the backend.
- Backend performs a fresh stock check.
- Product is added if stock is available.

---

## US-07 — Prevent Out-of-Stock Products

**As a user,**  
I should not be able to add an out-of-stock product to my cart.

### Acceptance Criteria

- Backend checks current stock.
- Out-of-stock products are rejected.
- Product is not added to the cart.
- Appropriate error response is returned.

---

## US-08 — Restore Failed Optimistic Update

**As a user,**  
I expect the wishlist to remain correct if adding to the cart fails.

### Acceptance Criteria

If the cart request fails:

1. Product is restored to the wishlist.
2. Error message is shown.
3. Cart remains unchanged.

---

# 7. Authentication

Users must have their own independent wishlist and cart.

### Requirements

- User registration.
- User login.
- Authentication middleware.
- Protected wishlist APIs.
- Protected cart APIs.
- User-specific database queries.

Example:

```text
User A
 ├── Wishlist A
 └── Cart A

User B
 ├── Wishlist B
 └── Cart B
```
