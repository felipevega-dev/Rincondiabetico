# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**Rincón Diabético** - Chilean e-commerce platform for desserts, cakes, and pastries. Store pickup only (no delivery) located in Chiguayante, Chile.

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Apply schema changes to database
- `npx prisma studio` - Open Prisma Studio GUI

## Tech Stack
- **Framework**: Next.js 15 with App Router + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: NeonDB (PostgreSQL) + Prisma ORM
- **Authentication**: Clerk (admin + customers)
- **Payments**: MercadoPago + bank transfer
- **Images**: Cloudinary
- **Deployment**: Vercel

## Code Architecture

### App Structure (Next.js 15 App Router)
```
src/app/
├── (account)/          # Customer account pages
├── (auth)/             # Authentication pages  
├── admin/              # Admin panel (protected)
├── api/                # API routes
├── checkout/           # Checkout flow
├── productos/          # Product catalog
└── [slug]/             # Dynamic CMS pages
```

### Database Schema (Prisma)
Key models:
- **User**: Clerk-synced users with Chilean contact info
- **Product**: Products with multiple images, stock, variations
- **ProductVariation**: Size/ingredient variations with price changes
- **Category**: Product categories
- **Order**: Order management with pickup scheduling
- **Payment**: MercadoPago and bank transfer tracking
- **Banner**: Homepage carousel banners
- **Page**: CMS pages for content management

### Component Structure
```
src/components/
├── admin/      # Admin panel components
├── client/     # Customer-facing components  
├── shared/     # Shared components (navbar, footer)
├── ui/         # Base UI components (shadcn/ui style)
└── providers/  # React context providers
```

### Key Libraries & Integrations
- **Clerk**: Authentication with Chilean localization
- **MercadoPago**: Payment processing for Chile
- **Resend**: Email notifications 
- **Cloudinary**: Image management
- **WhatsApp**: wa.me links for customer communication

## Chilean-Specific Considerations
- Currency: CLP (Chilean pesos) without cents
- Number format: 1.234.567 (dots as thousands separator)
- Payment methods: MercadoPago, bank transfer
- Business hours: Chilean commercial hours
- WhatsApp communication preferred

## Current Implementation Status
✅ **Complete**: Product catalog, cart, admin panel, authentication, basic checkout
🔄 **In Progress**: Email notifications, advanced stock management, payment optimization
📋 **Planned**: Advanced dashboard, scheduling system, product customization

## Development Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Server Components by default, Client Components when needed
- Spanish for UI/UX text, English for code
- Use `cn()` utility for conditional classes

### File Naming
- Components: PascalCase files (ProductCard.tsx)
- Pages: kebab-case (product-catalog/)
- Variables: camelCase
- Constants: UPPER_CASE

### Testing & Quality
- Run `npm run lint` before committing
- Test on mobile devices (mobile-first design)
- Verify Chilean peso formatting
- Test pickup scheduling logic

## Key Business Logic

### Order Flow
1. Customer adds items to cart
2. Selects pickup date/time during checkout
3. Chooses payment method (MercadoPago or transfer)
4. Order created with PENDIENTE status
5. Admin confirms and updates status
6. Customer receives notifications
7. Order marked LISTO when ready
8. Customer picks up, order marked RETIRADO

### Stock Management
- Real-time stock validation in cart
- Temporary reservation during checkout (15min)
- Admin alerts for low stock
- Prevent overselling

### Admin Features
- Product/category CRUD with image management
- Order status management  
- CMS for banners and pages
- Store settings configuration
- Basic sales reporting