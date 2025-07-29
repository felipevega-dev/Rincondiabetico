# 🍰 Rincón Diabético - E-commerce Platform

**Chilean e-commerce platform specializing in desserts, cakes, and pastries.**  
Store pickup only (no delivery) - Located in Chiguayante, Chile.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-green)

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (NeonDB recommended)
- Clerk account for authentication
- MercadoPago account for payments
- Cloudinary account for images
- Resend account for emails

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rincondiabetico.git
   cd rincondiabetico
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Fill in your actual values in .env
   ```

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

---

## 🏗️ **Tech Stack**

### **Core Framework**
- **Next.js 15** - App Router + Server Components
- **TypeScript** - Type safety throughout
- **Tailwind CSS v4** - Modern styling system

### **Database & Backend**
- **NeonDB** - Serverless PostgreSQL 
- **Prisma ORM** - Type-safe database access
- **Clerk** - Authentication & user management

### **Payments & Integrations**
- **MercadoPago** - Credit/debit card processing
- **Bank Transfer** - Manual payment option
- **Cloudinary** - Image optimization & management
- **Resend** - Transactional emails
- **WhatsApp** - Customer communication

### **Deployment**
- **Vercel** - Optimized for Next.js
- **Serverless Functions** - API routes
- **CDN** - Global content delivery

---

## 🎯 **Key Features**

### **🛍️ Customer Experience**
- ✅ Product catalog with advanced filtering
- ✅ Shopping cart with real-time stock validation
- ✅ Guest checkout (no registration required)
- ✅ Wishlist/favorites system
- ✅ Order tracking and history
- ✅ Pickup scheduling system
- ✅ Multiple payment methods
- ✅ Recently viewed products
- ✅ Product recommendations

### **👨‍💼 Admin Panel**
- ✅ Complete dashboard with analytics
- ✅ Product & category management
- ✅ Order management system
- ✅ Advanced stock management
- ✅ Coupon & discount system
- ✅ Customer analytics
- ✅ CMS for banners and pages
- ✅ Notification system
- ✅ Sales reporting

### **🇨🇱 Chilean Localization**
- ✅ Chilean peso (CLP) formatting
- ✅ WhatsApp integration
- ✅ Local business hours
- ✅ Pickup-only business model
- ✅ Bank transfer payments

---

## 📊 **Project Status**

**Current Progress**: 82.5% Complete (85/103 features)

### **✅ Completed Modules**
- **E-commerce Core** - Product catalog, cart, checkout
- **Authentication** - Clerk integration with roles
- **Order Management** - Complete order lifecycle
- **Payment Processing** - MercadoPago + bank transfer
- **Admin Dashboard** - Advanced management tools
- **Stock Management** - Real-time inventory tracking
- **Analytics System** - Sales, products, customer insights
- **Coupon System** - Discounts and promotions
- **Notification System** - Email + WhatsApp automation

### **🚧 In Development**
- Advanced admin tools (bulk operations)
- Loyalty program system
- Performance optimizations

---

## 🗂️ **Project Structure**

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (account)/         # Customer account pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin panel (role-protected)
│   ├── api/               # API routes & webhooks
│   ├── checkout/          # Checkout flow
│   └── productos/         # Product catalog
├── components/
│   ├── admin/             # Admin-specific components
│   ├── client/            # Customer-facing components
│   ├── shared/            # Reusable components
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions & configurations
└── types/                 # TypeScript type definitions
```

---

## 🚀 **Deployment**

### **Vercel (Recommended)**

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### **Environment Variables**
See `.env.example` for complete list of required variables.

**Critical for Production:**
- `DATABASE_URL` - NeonDB connection string
- `CLERK_SECRET_KEY` - Clerk authentication
- `MERCADOPAGO_ACCESS_TOKEN` - Payment processing
- `RESEND_API_KEY` - Email service
- `NEXT_PUBLIC_APP_URL` - Your domain

---

## 🛠️ **Development Commands**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Apply schema changes
npx prisma studio        # Open Prisma Studio GUI

# Utilities
npm run make-admin       # Make user admin (requires user ID)
```

---

## 📧 **Support & Documentation**

- **Technical Documentation**: `CLAUDE.md`
- **Project Status**: `ESTADO_ACTUAL.md` 
- **Feature List**: `FUNCIONALIDADES.md`
- **Business Logic**: See individual API route documentation

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

## 📄 **License**

This project is proprietary software for Rincón Diabético.

---

## 🏪 **About Rincón Diabético**

Rincón Diabético is a specialized Chilean bakery located in Chiguayante, focusing on high-quality desserts, cakes, and pastries. We operate on a pickup-only model, ensuring fresh products and personalized customer service.

**Contact Information:**
- 📍 Location: Chiguayante, Chile
- 📱 WhatsApp: Available through the platform
- 🌐 Website: [Your Domain]

---

**Made with ❤️ for the Chilean dessert community**