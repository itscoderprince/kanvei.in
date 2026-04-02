# 🏆 Kanvei.in - Next-Gen E-Commerce Architecture

✨ Built for performance, enterprise-grade scalability, and a premium shopping experience. Full-stack E-commerce ecosystem with secure payments, dynamic product options, multi-provider authentication, and a powerful admin dashboard.

### 🔐 Authentication & Security
- Hybrid Identity Management — NextAuth.js (Google, Facebook) + Custom JWT
- Granular Role-Based Access — Encrypted admin vs user context validation
- Proactive Security Measures — Login notifications & automated blocked-user middleware
- Password Hashing — Industry-standard `bcryptjs` encryption

### 🛒 E-Commerce Engine
- Payment Integration — Secure server-side processing & webhook logic via Razorpay
- Rich Product Catalog — Dynamic variants (Size, Color, Attributes) 
- Smart Promotional System — Multi-tier coupons with usage limits & date validation
- High-Performance Media Pipeline — Cloudinary integration with on-the-fly image transformations

### 📊 Admin Panel Dashboard
- Real-time Analytics — Comprehensive insights into revenue and customer metrics
- Order Management Pipeline — Advanced lifecycle tracking from creation to fulfillment
- Elegant UI Systems — Custom Tailwind CSS components & Framer Motion animations
- Rich Text Management — Integrated Jodit Editor for blogs and dynamic CMS content

### 📦 Application Routes Setup

`/admindashboard`

`/admindashboard/products`

`/admindashboard/categories`

`/admindashboard/orders`

`/admindashboard/users`

`/admindashboard/coupons`

`/admindashboard/reviews`

`/admindashboard/blogs`


```text
kanvei.in/
├── 📂 public/              # Static assets (fonts, icons, default images)
├── 📂 src/
│   ├── 📂 app/             
│   │   ├── 📂 (home)/           # Public-facing storefront 
│   │   ├── 📂 (shop)/           # Product discovery & categories
│   │   ├── 📂 admindashboard/   # CMS and Store Management Portal
│   │   └── 📂 api/              # Secure Next.js Serverless Endpoints
│   ├── 📂 components/      # UI Library (Atoms, Molecules, Organisms)
│   ├── 📂 contexts/        # React Context (Cart, Auth, Wishlist)
│   ├── 📂 hooks/           # Modular component logic
│   ├── 📂 lib/             # Core Utilities (Mongoose, Auth helpers)
│   └── 📂 models/          # 18+ MongoDB Schemas (User, Order, Product, etc)
├── 📜 next.config.mjs      # Framework optimizations & security headers
└── 📜 tailwind.config.js   # Design system token definitions
```

### Prerequisites
- Node.js `>= 18.x`
- MongoDB instance (Atlas or Local)
- Razorpay API Keys
- Cloudinary Credentials
- SMTP Config (Nodemailer)

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
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
FACEBOOK_APP_ID=your_id
FACEBOOK_APP_SECRET=your_secret

# Payments
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Storage
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉


## 🔒 Architecture & Data Integrity
- **Zero-Trust Validation**: All sensitive transaction logic executes server-side natively within Next.js API Routes.
- **Enterprise Modeling**: Complex MongoDB schema relationships ensure referential integrity across users, products, and orders.
- **Checkout Safety**: Dynamic backend cart and price validation happens just-in-time prior to the initiation of payment gateways.
- **Route Armor**: Advanced routing middleware effectively shields `/admindashboard` pipelines from unauthorized ingress.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss your proposed changes.

## 📄 License
This project is licensed under the MIT License.
Made with ❤️ by Kanvei Team

---
**Core Tech Stack Highlight:** Next.js 15, React 19, Tailwind CSS v4, MongoDB (Mongoose), NextAuth v4, Razorpay, Cloudinary
