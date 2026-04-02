<div align="center">

<img src="public/favicon.ico" alt="Kanvei Logo" width="80" height="80" style="border-radius: 16px;" />

# 🏆 Kanvei.in

### Premium Next-Generation E-Commerce Architecture

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0F88F2?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)

<br />

> ✨ **Built for performance, enterprise-grade scalability, and a premium shopping experience.**  
> Full-stack ecosystem with secure payments, dynamic product options, hybrid authentication, and a powerful CMS dashboard.

<br />

![Kanvei Preview Placeholder](https://placehold.co/900x400/121212/d4af37?text=Kanvei.in+Storefront)

</div>

---

## 🚀 Tech Stack Highlights

| Category | Technology |
|---|---|
| **Core Framework** | ![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=nextdotjs) |
| **UI Library** | ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white) |
| **Payment Gateway** | ![Razorpay](https://img.shields.io/badge/Razorpay-Webhook_Secured-0F88F2?logo=razorpay&logoColor=white) |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-18+_Enterprise_Schemas-47A248?logo=mongodb&logoColor=white) |
| **Media Pipeline**| ![Cloudinary](https://img.shields.io/badge/Cloudinary-On--the--fly_Transformations-3448C5?logo=cloudinary&logoColor=white) |
| **Auth & Security** | ![NextAuth](https://img.shields.io/badge/NextAuth.js-Hybrid_Flow-000000?logo=nextdotjs&logoColor=white) + ![bcrypt](https://img.shields.io/badge/bcryptjs-Password_Hashing-0f172a) |
| **Content Editor** | ![Jodit](https://img.shields.io/badge/Jodit_Editor-Rich_Text-FF4500) |
| **Email Service** | ![Nodemailer](https://img.shields.io/badge/Nodemailer-SMTP_Delivery-22c55e) |

---

## ✨ Features

### 🔐 Authentication & Security
- **Hybrid Identity Management** — Multi-provider authentication via **NextAuth.js** (Google, Facebook) + Custom JWT
- **Role-Based Access Control** — Encrypted routing logic separating Consumer and Admin privileges
- **Proactive Threat Mitigation** — Login notifications & automated blocked-user middleware checks
- **Password Hashing** — Industry-standard `bcryptjs` encryption

### 🛒 E-Commerce Engine
- **Transactional Integrity** — Deep integration with **Razorpay SDK** for secure, server-side verified payments
- **Complex Inventory Data Patterns** — Dynamic product configurations (Size, Color, Variant Attributes)
- **Promotional Engine** — Advanced multi-tier coupon system with usage bounds & contextual validation
- **High-Performance Media** — Integrated **Cloudinary** asset pipeline minimizing LCP scores

### 📊 Enterprise CMS Dashboard
- **Real-Time Data Mutability** — High-complexity state management for real-time control over products and orders
- **Order Lifecycle Pipeline** — Granular tracking from cart instantiation to final delivery fulfillment
- **Rich Text Management** — Integrated **Jodit Editor** powering blog articles and product descriptions

### 📦 Application Routing Setup
| Management Module | Secure Route |
|---|---|
| 📈 Analytics / Home | `/admindashboard` |
| 🛍️ Product Catalog | `/admindashboard/products` |
| 🗂️ Categories | `/admindashboard/categories` |
| 📋 Order Pipeline | `/admindashboard/orders` |
| 👥 User Management | `/admindashboard/users` |
| 🎟️ Coupon Engine | `/admindashboard/coupons` |
| ⭐ Review Moderation | `/admindashboard/reviews` |
| 📝 Blog CMS | `/admindashboard/blogs` |

---

## 🗂️ Distributed Project Architecture

```text
kanvei.in/
├── 📂 public/              # Static assets (fonts, icons, default images)
├── 📂 src/
│   ├── 📂 app/             
│   │   ├── 📂 (home)/           # Public-facing luxury storefront 
│   │   ├── 📂 (shop)/           # Categorized product discovery
│   │   ├── 📂 admindashboard/   # Highly secure CMS and Store Admin Portal
│   │   └── 📂 api/              # Mission-critical Next.js Serverless Endpoints
│   ├── 📂 components/      # UI Library (Atoms, Molecules, Layouts)
│   ├── 📂 contexts/        # Persistent Global State (Cart, Auth, Wishlist)
│   ├── 📂 hooks/           # Encapsulated component logic
│   ├── 📂 lib/             # Enterprise Utilities (Mongoose connections, Auth helper)
│   └── 📂 models/          # 18+ Scalable Mongoose Schemas (CartItem, Order, User, etc.)
├── 📜 next.config.mjs      # Framework optimizations & runtime routing rules
└── 📜 tailwind.config.js   # Design system tokens and layout utilities
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **MongoDB** instance (Atlas or Local)
- **Razorpay API Keys** for checkout functioning
- **Cloudinary Credentials** for product image upload routing
- **SMTP** credentials for email delivery (Gmail, Resend, etc.)

### 1. Clone the repository

```bash
git clone https://github.com/itscoderprince/kanvei.in.git
cd kanvei.in
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database Ecosystem
MONGODB_URI=mongodb+srv://...

# Application Identity
JWT_SECRET=your_super_secret_jwt_key_here
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Strategies
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
FACEBOOK_APP_ID=your_id
FACEBOOK_APP_SECRET=your_secret

# Payment Gateway
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Asset Management
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔒 Architecture & Security Assurance

- **Zero-Trust Validation**: All sensitive transaction logic executes server-side natively within Next.js API Routes.
- **Enterprise Modeling**: Complex MongoDB schema relationships ensure rigorous referential integrity across E-commerce workflows.
- **Checkout Safety**: Dynamic backend cart and price validation guarantees monetary integrity just prior to payment initiation.
- **Route Armor**: Custom middleware effectively shields all `/admindashboard` pipelines from unauthorized ingress.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your proposed changes.

```bash
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "feat: add amazing feature"

# Push to the branch
git push origin feature/amazing-feature
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Made with ❤️ by **Kanvei Team**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-d4af37?style=for-the-badge)](#)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-000?style=for-the-badge&logo=github)](https://github.com/itscoderprince)

</div>
