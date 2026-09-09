# Flipkart Wishlist Stock Tracker - UX Mockup

This document outlines the user interface, component layout, and user flows for the Flipkart Wishlist Stock Tracker application.

## 1. Global Navigation (Navbar)
The top navigation bar is fixed and provides quick access to core sections.

| Logo / Branding | Search Bar (Optional) | Links | User Actions |
| :--- | :--- | :--- | :--- |
| **Flipkart Clone** | `[ Search products... 🔍 ]` | `Home` \| `Stocks` | 🛒 Cart (2) \| ❤️ Wishlist (3) \| 👤 Profile |

> [!NOTE]
> The Cart and Wishlist icons display dynamic badges indicating the number of items currently inside them.

---

## 2. Product Listing Page (Home)
Displays available products in a responsive grid layout.

**Layout: 3-column grid (Desktop) / 1-column (Mobile)**

```text
+-------------------------+  +-------------------------+  +-------------------------+
| [ Product Image ]       |  | [ Product Image ]       |  | [ Product Image ]       |
|                         |  |                         |  |                         |
| iPhone 15 Pro           |  | Nike Air Max 270        |  | Sony WH-1000XM5         |
| ₹1,29,900               |  | ₹11,495                 |  | ₹29,990                 |
|                         |  |                         |  |                         |
| [ Add to Cart 🛒 ]      |  | [ Out of Stock ❌ ]     |  | [ Add to Cart 🛒 ]      |
| [ Add to Wishlist ❤️ ]  |  | [ Add to Wishlist ❤️ ]  |  | [ Add to Wishlist ❤️ ]  |
+-------------------------+  +-------------------------+  +-------------------------+
```

---

## 3. Wishlist Page (❤️)
Displays saved items and actively polls their stock status every 30 seconds.

> [!IMPORTANT]
> **Stock Polling:** A subtle "Last updated: just now" indicator appears at the top. Items dynamically change their stock status without a page refresh.

**List View:**

```text
❤️ My Wishlist (2 Items)                      [ Auto-checking stock in 12s ⏳ ]
-------------------------------------------------------------------------------
[ Image ] | iPhone 15 Pro     | ₹1,29,900 | ✅ In Stock     | [ Move to Cart ]
-------------------------------------------------------------------------------
[ Image ] | Nike Air Max 270  | ₹11,495   | ❌ Out of Stock | [ Move to Cart ] (Disabled)
-------------------------------------------------------------------------------
```
*When "Move to Cart" is clicked, the item is optimistically removed from the Wishlist and instantly appears in the Cart.*

---

## 4. Cart Page (🛒)
Displays items ready for checkout. Prevents out-of-stock items from being added.

**List View & Summary:**

```text
🛒 Shopping Cart (1 Item)
-------------------------------------------------------------------------------
[ Image ] | iPhone 15 Pro     | ₹1,29,900 | Qty: [ - ] 1 [ + ] | [ Remove 🗑️ ]
-------------------------------------------------------------------------------

                                                     --------------------------
                                                     | Order Summary          |
                                                     | Total: ₹1,29,900       |
                                                     | [ Proceed to Checkout ]|
                                                     --------------------------
```

---

## 5. User Flows & State Diagram

The following mermaid diagram visualizes the optimistic UI flow when a user moves an item from the Wishlist to the Cart:

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend (React)
    participant W as Wishlist API
    participant C as Cart API

    U->>UI: Clicks "Move to Cart" on Wishlist item
    UI->>UI: Optimistically remove from Wishlist state
    UI->>UI: Optimistically add to Cart state
    UI-->>U: Shows "Moved to Cart" Toast Notification
    
    parallel API Requests
        UI->>C: POST /api/cart { productId }
        UI->>W: DELETE /api/wishlist?id={productId}
    end
    
    C-->>UI: 200 OK (Cart updated)
    W-->>UI: 200 OK (Wishlist updated)
```

## 6. Toast Notifications
To provide immediate feedback for optimistic actions, toast notifications appear in the bottom-right corner:
- ✅ `Added "iPhone 15 Pro" to Wishlist`
- ✅ `Moved "iPhone 15 Pro" to Cart`
- ❌ `Cannot add "Nike Air Max 270" to cart: Item is out of stock!`

## 7. Error Handling (Edge Cases)
If the backend fails during an optimistic update (e.g., trying to add an item that just went out of stock):
1. The backend returns `409 Conflict`.
2. The UI catches the error.
3. The UI reverts the optimistic state (item is removed from Cart and put back in Wishlist).
4. A red toast notification alerts the user: `Failed to move item: Insufficient stock.`
