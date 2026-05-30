# 💳 VaultPay Financial Core — Secure Financial Operations Platform

## 📸 Project Preview

🔗 Live Demo: [https://vaultpay-9pqp.vercel.app/login](https://vaultpay-9pqp.vercel.app/login)

### 🔑 Secure Gateway Authentication
![Login Page](/login.png)

### 📈 Finance Admin Console (Operations Console)
![Admin Page](/admin.png)

### 📁 Client Billing Portal (Statements Console)
![Client Page](/client.png)

---

A **Secure Financial Operations Platform** built for consultancy firms and enterprise service providers to manage invoices, payments, client billing, and financial documents through a centralized role-based portal.

This project focuses heavily on:

* Role-Based Access Control (RBAC)
* Secure financial workflows
* Stripe-inspired payment experiences
* Invoice management systems
* Document vault architecture
* Enterprise SaaS dashboard design

Inspired by modern financial platforms such as Stripe, Ramp, Brex, and QuickBooks.

---

## 🚀 Features

### ✅ Requirement 1 — Strict Role-Based Access Control (RBAC)

* Secure Admin and Client role separation
* Middleware-based route protection
* Layout-level authorization guards
* Dynamic role-aware navigation
* Unauthorized route blocking
* Dedicated 403 Unauthorized handling
* Session-aware dashboard routing

#### Admin Access

* Revenue overview
* Invoice management
* Client management
* Payment monitoring

#### Client Access

* Personal invoice history
* Invoice detail pages
* Payment actions
* Document downloads

---

### ✅ Requirement 2 — Checkout Flow & Async UX Protection

* Stripe-inspired Checkout Experience
* Async-safe payment mutations
* Instant loading states
* Button locking during processing
* Double-click prevention
* Mutation-based request handling
* Professional payment feedback states
* Status-aware payment actions

#### Payment Protection Features

* Disabled payment buttons during processing
* Loading indicators and spinners
* Error recovery messaging
* Success state handling
* Simulated checkout workflow

---

### ✅ Requirement 3 — Document Vault

* Professional Invoice Detail Pages
* Dynamic invoice viewing
* Native PDF download flow
* Async-safe document generation
* Download state protection
* Status-aware invoice actions
* Financial document presentation

#### Document Features

* Invoice breakdowns
* Billing information
* Client details
* Downloadable PDF invoices
* Receipt access for paid invoices

---

## 🧠 Key Design Decisions

### 🔐 Multi-Layered RBAC Architecture

Authorization is enforced through:

* Edge middleware
* Layout guards
* Role-aware navigation
* Protected route groups

This prevents unauthorized users from accessing restricted areas even through direct URL manipulation.

---

### ⚡ Async UX Protection

Payment and download actions use mutation-based workflows to prevent:

* duplicate requests
* double clicks
* accidental repeated submissions
* confusing loading states

---

### 📄 Shared Invoice Architecture

A reusable invoice detail system powers:

* Admin invoice views
* Client invoice views
* Document downloads

while preserving strict role separation.

---

### 📄 Enterprise SaaS Dashboard Design

The platform follows modern SaaS patterns inspired by:

* Stripe
* Ramp
* Brex
* QuickBooks
* Vercel

with emphasis on:

* readability
* information hierarchy
* operational workflows
* clean financial UX

---

## 📂 Project Structure

```text
vaultpay-financial-core/
│
├── public/
│   ├── login.png
│   ├── admin.png
│   └── client.png
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── (admin)/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── invoices/
│   │   │   │   │   ├── clients/
│   │   │   │   │   └── payments/
│   │   │   │
│   │   │   └── (client)/
│   │   │       ├── invoices/
│   │   │       └── checkout/
│   │
│   │   ├── unauthorized/
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── invoices/
│   │   ├── payments/
│   │   └── clients/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── stores/
│   └── types/
│
├── middleware.ts
├── README.md
└── prompts.md
```

---

## 🛠️ Technologies Used

### Frontend

* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS
* Zustand
* TanStack Query
* Axios
* Lucide React
* React Hook Form
* Zod
* Shadcn/ui

### State Management

* Zustand
* TanStack Query

### UI & UX

* Responsive SaaS Dashboard
* Professional Financial UI
* Dynamic Tables
* Modal Workflows
* Async Feedback Systems

### Deployment

* Vercel

---

## ⚡ Application Architecture

```text
User
  ↓
Authentication
  ↓
RBAC Middleware
  ↓
Layout Guards
  ↓
Role-Based Dashboard
  ↓
Invoices / Payments / Documents
```

### Admin Workflow

1. Login as Administrator
2. Access Operations Dashboard
3. Manage Invoices
4. Manage Clients
5. Monitor Payments
6. Export Operational Data

### Client Workflow

1. Login as Client
2. View Personal Invoices
3. Open Invoice Details
4. Download Documents
5. Complete Payment Flow

---

## 🧪 How to Run the Project

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vaultpay-financial-core
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Create:

```env
.env.local
```

Example:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 4. Start Development Server

```bash
npm run dev
```

---

### 5. Open Application

```text
http://localhost:3000
```

---

### 6. Test Role-Based Access

#### Admin

* Login as Admin
* Access:

  * Dashboard
  * Invoices
  * Clients
  * Payments

#### Client

* Login as Client
* Access:

  * Invoices
  * Payments
  * Documents

Attempting to access unauthorized routes redirects to:

```text
/unauthorized
```

---

## 🌐 Production Deployment

### Live Application

[https://vaultpay-9pqp.vercel.app/login](https://vaultpay-9pqp.vercel.app/login)

### Deployment Platform

* Vercel

### Production Features

* RBAC enforcement
* Responsive layouts
* Financial dashboard workflows
* Invoice management
* Payment simulations
* Document vault experience

---

## 🤖 AI Assistance Disclaimer

AI tools were used for:

* architecture planning
* RBAC design guidance
* payment workflow design
* invoice management architecture
* document vault planning
* dashboard UX refinement
* frontend scalability recommendations
* debugging assistance

All code was manually implemented, tested, refined, and validated to ensure:

* secure role-based access
* professional payment workflows
* reliable document management
* scalable frontend architecture
* production-quality user experience

Detailed AI interactions are documented in:

```text
prompts.md
```

---

## 👨💻 Author

**Krishna Kumar**
Frontend Developer Intern — Prodesk IT
