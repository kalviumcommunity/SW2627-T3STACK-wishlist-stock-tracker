# Wishlist Stock Tracker

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

The primary user is an e-commerce customer who:

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
