# Product Requirements Document (PRD)
**Project Name:** Wishlist & Stock Tracker (SW2627-T3STACK)
**Date:** August 25, 2026

---

## 1. Product Overview
The **Wishlist & Stock Tracker** is a modern, responsive web application designed to help users track their desired products across various e-commerce platforms. It allows users to build a centralized wishlist, monitor stock availability, and seamlessly manage their intent to purchase. 

By automating the tracking of inventory status ("In Stock" / "Out of Stock"), users no longer need to manually check storefronts to see if their desired items are available to buy.

## 2. Target Audience
- **Frequent Shoppers:** Users who track multiple items across different stores and wait for restocks.
- **Deal Hunters:** Shoppers monitoring specific items for availability before making a purchasing decision.
- **Organized Planners:** Users who want a centralized dashboard to save items for future events (birthdays, holidays).

## 3. Technology Stack
The application is built using a modern **T3-inspired stack**:
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Custom JWT-based authentication using bcryptjs and HTTP-only cookies.

---

## 4. Core Features (MVP)

### 4.1. User Authentication & Authorization
- **Sign Up / Registration:** Users can create an account using a unique email address and secure password.
- **Login / Logout:** Users can securely authenticate. Sessions are maintained via HTTP-only cookies.
- **Protected Routes:** Wishlists and dashboards are strictly tied to authenticated users.

### 4.2. Wishlist Management
- **Add to Wishlist:** Users can save products (Name, Price, Brand, Image URL) to their personal list.
- **View Wishlist:** Users can see a grid/list view of all their saved items.
- **Remove from Wishlist:** Users can delete items they are no longer interested in.

### 4.3. Stock Tracking
- **Stock Status Indicators:** Items visually indicate whether they are currently "In Stock" or "Out of Stock."
- **Dashboard Overview:** A centralized view to quickly see which high-priority items have recently returned to stock.

### 4.4. Cart Integration
- **Move to Cart:** Users can seamlessly move an item from their wishlist into an active shopping cart for immediate checkout planning.
- **Cart Management:** View current cart totals and remove items from the cart.

---

## 5. User Flows

### Flow 1: Onboarding
1. User navigates to the landing page.
2. User clicks "Login" or "Sign Up".
3. User enters credentials.
4. Upon success, user is redirected to the `/dashboard`.

### Flow 2: Adding an Item
1. Authenticated user navigates to `/wishlist`.
2. User clicks "Add Item".
3. User provides product details (Name, Price, Link/Image).
4. Item appears in the wishlist grid.

### Flow 3: Monitoring Stock
1. User visits `/dashboard` or `/stocks`.
2. System highlights items that have recently changed from "Out of Stock" to "In Stock".

---

## 6. Data Architecture (Prisma Schema)

### `User` Model
- `id`: String (CUID, Primary Key)
- `name`: String
- `email`: String (Unique)
- `passwordHash`: String
- `createdAt`: DateTime

### `WishlistItem` Model
- `id`: String (CUID, Primary Key)
- `userId`: String (Foreign Key to User)
- `productName`: String
- `price`: Float
- `imageUrl`: String (Optional)
- `brand`: String (Optional)
- `inStock`: Boolean (Default: true)
- `createdAt`: DateTime

*(Future models may include `CartItem` and `PriceHistory`)*

---

## 7. Future Enhancements (Post-MVP)
1. **Automated Scraping:** Automatically update stock status and prices by scraping product URLs.
2. **Email/Push Notifications:** Alert users immediately when an "Out of Stock" item becomes available.
3. **Price Drop Alerts:** Notify users if a wishlist item drops below a defined target price.
4. **Public Wishlists:** Allow users to share a read-only version of their wishlist with friends and family.
