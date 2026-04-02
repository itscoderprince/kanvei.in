# 🏆 Kanvei.in - Enterprise-Grade E-Commerce Architecture

> **A highly scalable, secure, and production-ready Full-Stack ecosystem.**
> This project is designed to demonstrate mastery over modern web standards, focusing on high-performance data patterns, secure transactional flows, and complex administrative state management.

---

## 🚀 Key Technical Value Propositions (Job-Critical Skills)

### 🛡️ Advanced Identity & Security Infrastructure
- **Hybrid Authentication**: Implemented a multi-provider strategy using **NextAuth.js** (Google, Facebook) alongside a custom **JWT-based Credentials** provider.
- **Security Protocols**: Production-grade password hashing with **BCryptJS**, secure session management, and granular role-based access control (RBAC).
- **Proactive Protection**: Built-in account monitoring with **Login Notification triggers** and automated **Blocked User middleware** to prevent unauthorized access.

### 💳 Robust Transactional Integrity
- **Payment Ecosystem**: Deep integration with **Razorpay SDK** for secure, server-side verified transactions.
- **Order Lifecycle**: Precision management of inventory state, order tracking, and dynamic tax/shipping calculations.
- **Promotional Engine**: Complex coupon logic with usage limits, expiration, and category-specific validation.

### 🏗️ Enterprise Data Patterns
- **Database Architecture**: High-performance **MongoDB + Mongoose** schema design featuring 18+ models optimized for query speed and data integrity.
- **Asset Pipeline**: Advanced media management via **Cloudinary**, utilizing server-side transformations and edge delivery to minimize LCP (Largest Contentful Paint).
- **SEO & Performance**: Optimized **Next.js 15** App Router implementation with server-side pre-fetching and metadata optimization for maximal search visibility.

---

## 📁 Optimized Directory Blueprint

| Directory | Core Responsibility | Technical Importance |
| :--- | :--- | :--- |
| **`src/app/api`** | Mission-Critical Backend | Handles sensitive logic like payment verification, auth callbacks, and secure data mutation. |
| **`src/app/admindashboard`** | Enterprise CMS | A high-complexity state managed area for real-time control over products, orders, and user behavior. |
| **`src/lib/models`** | Scalable Data Schema | Defines the application’s "source of truth"—supporting complex relationships between products, variants, and reviews. |
| **`src/contexts`** | Persistent Global State | Efficiently synchronizes Cart, Wishlist, and Auth states across the entire user journey without performance overhead. |
| **`src/components/shared`**| Modular Design System | A library of highly reusable, accessible (A11y), and responsive UI components. |

---

## ⚙️ Core Architecture Overview

### 1. The Data Layer
Leverages **Mongoose** to provide a structured, schema-based solution to model application data. Includes rich features like built-in type casting, validation, and query building.

### 2. The Interaction Layer
Utilizes **React 19** Server and Client components to balance performance (server-first) with interactivity (client-side state).

### 3. The Deployment Layer
Configured for high availability with optimized build logging and environment-driven configurations for production safety.

---

## 🛠️ Quick Installation

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/itscoderprince/kanvei.in.git
    npm install
    ```
2.  **Configure Environment**:
    Set your `MONGODB_URI`, `JWT_SECRET`, and API Keys in a `.env` file.
3.  **Launch Production Engine**:
    ```bash
    npm run dev
    ```

---
💎 *Developed with focus on Scalability, Security, and Code Quality.*
