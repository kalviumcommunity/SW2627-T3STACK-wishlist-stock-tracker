# Team Work Division

## Team 05 — Wishlist Stock Monitoring System

**Campus:** JECRC  
**Squad:** 124  
**Sprint:** 1  
**Team Size:** 3

---

# Team Members

| Member | Primary Area | Main Responsibility |
|---|---|---|
| Mohit Singh | Backend + Database | Database, Prisma, APIs, business logic, stock validation |
| Kumkum Kushwah | Backend Infrastructure | Server setup, authentication, middleware, configuration, error handling |
| Virendra Singh | Frontend | UI, wishlist, cart, stock polling, API integration |

---

# 1. Mohit Singh — Backend + Database

## Primary Responsibility

Mohit is responsible for the **database layer, core backend APIs, and business logic**.

### Tasks

- [ ] Design PostgreSQL database
- [ ] Create Prisma schema
- [ ] Create `User` model
- [ ] Create `Product` model
- [ ] Create `Wishlist` model
- [ ] Create `Cart` model
- [ ] Define database relationships
- [ ] Run Prisma migrations
- [ ] Create product APIs
- [ ] Create wishlist APIs
- [ ] Create cart APIs
- [ ] Implement stock validation
- [ ] Implement wishlist-to-cart business logic
- [ ] Handle out-of-stock cases
- [ ] Write backend tests

### Main Backend Responsibility

```text
Database
   ↓
Prisma
   ↓
Business Logic
   ↓
API Controllers
   ↓
API Response
```

### Key APIs

```text
GET    /api/products
GET    /api/products/:id

GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId

GET    /api/cart
POST   /api/cart
DELETE /api/cart/:productId
```

### Critical Logic

Mohit owns the final stock validation:

```text
Add to Cart Request
        ↓
Find Product
        ↓
Check Current Stock
        ↓
   ┌────┴────┐
   ↓         ↓
In Stock   Out of Stock
   ↓         ↓
Add Cart   Reject
```

---

# 2. Kumkum Kushwah — Backend Infrastructure

## Primary Responsibility

Kumkum is responsible for the **backend foundation and infrastructure**.

Basic backend server setup is already started by Kumkum.

### Tasks

- [ ] Express/backend server setup
- [ ] Environment configuration
- [ ] `.env` configuration
- [ ] CORS configuration
- [ ] Middleware setup
- [ ] Authentication foundation
- [ ] Authentication middleware
- [ ] Request validation
- [ ] Centralized error handling
- [ ] API response structure
- [ ] Backend logging
- [ ] Backend testing setup
- [ ] Backend documentation

### Backend Structure

```text
backend/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── utils/
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── .env
├── package.json
└── tsconfig.json
```

### Kumkum's Main Responsibility

```text
Incoming Request
       ↓
Middleware
       ↓
Authentication
       ↓
Validation
       ↓
Controller
       ↓
Service
       ↓
Database
```

Kumkum should make sure the backend foundation is stable so that Mohit's APIs can be built on top of it.

---

# 3. Virendra Singh — Frontend

## Primary Responsibility

Virendra is responsible for the **frontend application and user experience**.

Basic frontend setup is already started by Virendra.

### Tasks

- [ ] Next.js frontend setup
- [ ] Application layout
- [ ] Product catalogue
- [ ] Product cards
- [ ] Product details
- [ ] Wishlist UI
- [ ] Cart UI
- [ ] Add/remove wishlist functionality
- [ ] Add/remove cart functionality
- [ ] Stock status UI
- [ ] 30-second stock polling
- [ ] Optimistic wishlist removal
- [ ] Restore wishlist after failed cart request
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Responsive UI

### Frontend Structure

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── ProductCard/
│   │   ├── Wishlist/
│   │   ├── Cart/
│   │   └── Navbar/
│   │
│   ├── app/
│   │   ├── products/
│   │   ├── wishlist/
│   │   └── cart/
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── hooks/
│   │   └── useStockPolling.ts
│   │
│   └── types/
│
├── package.json
└── ...
```

---

# How The Three People Work Together

The team should **not work as three completely separate projects**.

```text
                    FRONTEND
                  Virendra
                     │
                     │ API Requests
                     ▼
               BACKEND SERVER
                  Kumkum
                     │
                     ▼
               BUSINESS LOGIC
                   Mohit
                     │
                     ▼
                 PRISMA
                     │
                     ▼
                POSTGRESQL
```

---

# Dependency Order

## Step 1 — Backend Foundation

**Kumkum**

```text
Server
 ↓
Middleware
 ↓
Environment
 ↓
Authentication foundation
```

## Step 2 — Database

**Mohit**

```text
Prisma
 ↓
Schema
 ↓
Migration
 ↓
Database
```

## Step 3 — Backend APIs

**Mohit + Kumkum**

```text
Database
   ↓
Services
   ↓
Controllers
   ↓
Routes
```

## Step 4 — Frontend

**Virendra**

Virendra can build the UI independently using mock data initially.

```text
Products
 ↓
Wishlist
 ↓
Cart
```

Then connect the real APIs once they are ready.

---

# Three-Week Task Division

## Week 1 — Foundation

### Mohit

- [ ] Design database
- [ ] Create Prisma schema
- [ ] Create migrations
- [ ] Seed products
- [ ] Create product API

### Kumkum

- [ ] Complete backend server
- [ ] Configure middleware
- [ ] Configure environment
- [ ] Authentication foundation
- [ ] Error handling

### Virendra

- [ ] Complete Next.js setup
- [ ] Build application layout
- [ ] Build product catalogue
- [ ] Build product cards
- [ ] Build basic wishlist UI

---

# Week 2 — Core Features

### Mohit

- [ ] Wishlist API
- [ ] Cart API
- [ ] Stock validation
- [ ] Wishlist-to-cart logic
- [ ] Backend tests

### Kumkum

- [ ] Authentication
- [ ] Protected routes
- [ ] Request validation
- [ ] Error handling
- [ ] API integration support
- [ ] Backend testing

### Virendra

- [ ] Complete wishlist page
- [ ] Complete cart page
- [ ] Connect wishlist API
- [ ] Connect cart API
- [ ] Add loading states
- [ ] Add error states

---

# Week 3 — Integration

### Mohit

- [ ] Fix backend bugs
- [ ] Test stock edge cases
- [ ] Test concurrent cart requests
- [ ] Improve database queries
- [ ] Backend integration testing

### Kumkum

- [ ] Full API testing
- [ ] Authentication testing
- [ ] Error handling improvements
- [ ] Docker setup
- [ ] GitHub Actions
- [ ] Deployment support

### Virendra

- [ ] Implement 30-second polling
- [ ] Implement optimistic removal
- [ ] Restore wishlist on failure
- [ ] Complete responsive design
- [ ] Frontend testing
- [ ] Fix UI bugs

---

# Shared Integration Tasks

These tasks belong to **everyone**.

- [ ] Connect frontend and backend
- [ ] Test complete user flow
- [ ] Fix integration bugs
- [ ] Review each other's PRs
- [ ] Update Kanban board
- [ ] Write daily journals
- [ ] Keep README updated
- [ ] Prepare final demo

---

# Final End-to-End Test

All three members must test this flow together:

```text
User Login
    ↓
Product Catalogue
    ↓
Add Product to Wishlist
    ↓
Wishlist
    ↓
Stock Check
    ↓
30 Seconds
    ↓
Stock Check Again
    ↓
Click "Add to Cart"
    ↓
Frontend removes item immediately
    ↓
Backend receives request
    ↓
Backend checks current stock
    │
    ├───────────────┐
    ↓               ↓
In Stock        Out of Stock
    ↓               ↓
Add to Cart     Reject Request
                    ↓
              Restore Wishlist
```

---

# Ownership Rules

## Every task must have one owner

Avoid:

```text
"Someone will handle the cart."
```

Use:

```text
Owner: Mohit
Task: Cart API
```

## Every task should have a GitHub issue

Example:

```text
Issue #12
Title: Create Wishlist API
Owner: Mohit
Status: In Progress
```

## Every completed task should have a PR

```text
Issue
 ↓
Branch
 ↓
Code
 ↓
Commit
 ↓
Pull Request
 ↓
Review
 ↓
Merge
```

---

# Code Review Rule

The person who writes the feature should **not be the only person reviewing it**.

Example:

```text
Mohit creates Wishlist API
        ↓
Kumkum reviews backend
        ↓
Merge
```

```text
Virendra creates Wishlist UI
        ↓
Mohit/Kumkum reviews
        ↓
Merge
```

---

# Daily 1-Hour Workflow

Because the team is working approximately **1 hour per day**, avoid spending the entire session in meetings.

```text
5 min
Daily Check-in
    ↓
5 min
Task Assignment
    ↓
45 min
Development
    ↓
5 min
Commit / PR / Journal
```

---

# Daily Accountability

Every member should submit:

```text
Yesterday:
What did I complete?

Today:
What will I work on?

Blocked:
Yes / No

Blocker:
If applicable

PR/Commit:
GitHub link
```

The Team Lead can use the automated daily summary to see:

```text
Team 05 — Daily Summary

Mohit
Yesterday: Prisma schema
Today: Wishlist API
Blocked: No
PR: #12

Kumkum
Yesterday: Middleware
Today: Authentication
Blocked: No
PR: #13

Virendra
Yesterday: Product UI
Today: Wishlist UI
Blocked: No
PR: #14
```

---

# Definition of Done

A task is **Done** only when:

- [ ] Code is implemented.
- [ ] Code works locally.
- [ ] Relevant tests pass.
- [ ] Changes are committed.
- [ ] Pull request is created.
- [ ] Another team member reviews it.
- [ ] PR is merged.
- [ ] Kanban card is moved to `Done`.
- [ ] Daily journal is updated.

---

# Team Principle

The team should work as:

```text
Kumkum
Backend Foundation
       │
       ▼
Mohit
Database + APIs
       │
       ▼
Virendra
Frontend + Integration
       │
       ▼
     PRODUCT
```

The responsibility is **not isolated**.

Everyone should understand the complete system well enough to explain:

- What the product does.
- How the frontend communicates with the backend.
- How the database stores wishlist and cart data.
- Why stock is checked every 30 seconds.
- Why the cart performs another stock check.
- How optimistic updates work.
- What happens when the cart request fails.
