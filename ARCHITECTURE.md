# AzharStore - Architecture & Codebase Review

## Overview

AzharStore is a full-stack e-commerce application with a **distributed architecture** featuring:
- **Frontend**: React + Vite (deployed on Cloudflare Pages)
- **Backend**: FastAPI + Python (deployed on Dokploy)
- **Database**: Supabase (PostgreSQL)

---

## Architecture

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare CDN/Pages                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  admin.azhar.store          beta.azhar.store                 │
│  (IP-restricted)            (Public)                         │
│       │                          │                           │
│       └──────────┬───────────────┘                           │
│                  │                                           │
│         Single React App (SPA)                               │
│         - Dual routing logic                                 │
│         - Admin panel + Storefront                           │
│                  │                                           │
└──────────────────┼───────────────────────────────────────────┘
                   │
                   │ HTTPS/REST API
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  api.azhar.store                             │
│                  (Dokploy - FastAPI)                         │
│                                                               │
│  - REST API endpoints                                        │
│  - Business logic                                            │
│  - Authentication (JWT)                                      │
│  - CORS configuration                                        │
│                  │                                           │
└──────────────────┼───────────────────────────────────────────┘
                   │
                   │ PostgreSQL Protocol
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase                                  │
│                                                               │
│  - PostgreSQL Database                                       │
│  - Storage (product images)                                  │
│  - Real-time capabilities                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Routing Strategy

**Production:**
- `admin.azhar.store` → Admin panel (hostname-based, IP-restricted via Cloudflare)
- `beta.azhar.store` → Storefront (hostname-based, public)
- `beta.azhar.store/admin` → Blocked, redirects to home

**Local Development:**
- `localhost:3000/admin` → Admin panel (path-based)
- `localhost:3000` → Storefront

---

## Frontend Architecture

### Technology Stack

- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router DOM 6.20
- **HTTP Client**: Axios 1.6
- **State Management**: React Context API
- **Internationalization**: i18next + react-i18next
- **Icons**: Lucide React

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── ProductManagement.jsx
│   │   │   ├── CategoryManagement.jsx
│   │   │   ├── CustomerManagement.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   └── Settings.jsx
│   │   ├── Login.jsx
│   │   ├── StoreFront.jsx  # Customer-facing store (placeholder)
│   │   └── Home.jsx
│   ├── services/           # API service layer
│   │   └── api.js          # Axios instance + API methods
│   ├── i18n/               # Internationalization
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── ar.json
│   │   └── i18n.js
│   ├── styles/             # Global styles
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Entry point
├── public/
├── .env.example            # Environment variable template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json
```

### Key Frontend Components

#### App.jsx - Routing Logic

The main app component implements **dual routing**:

```javascript
const isAdminSite = 
  window.location.hostname.startsWith('admin') ||  // Production
  (window.location.hostname.includes('localhost') && location.pathname.startsWith('/admin')) || // Local dev
  (window.location.hostname.includes('127.0.0.1') && location.pathname.startsWith('/admin'));
```

This enables:
- Production admin access via `admin.azhar.store`
- Local development via `localhost:3000/admin`
- Blocks public access to admin on `beta.azhar.store`

#### AuthContext - Authentication

- Manages JWT token in localStorage
- Provides login/logout functionality
- Token is automatically attached to API requests via axios interceptor

#### ProtectedRoute - Route Guards

- Wraps admin routes to require authentication
- Redirects to `/login` if no valid token

#### API Service Layer

Centralized API calls with:
- Automatic token injection
- Error handling and 401 redirect
- Environment-based API URL configuration

---

## Backend Architecture

### Technology Stack

- **Framework**: FastAPI (async Python web framework)
- **Database Client**: Supabase Python SDK
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Pydantic models
- **CORS**: FastAPI CORSMiddleware

### Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app initialization
│   ├── api.py               # API route handlers
│   ├── config.py            # Configuration & CORS
│   ├── schemas.py           # Pydantic models
│   ├── services.py          # Business logic
│   ├── customer_services.py # Customer-specific logic
│   ├── supabase_client.py   # Supabase client setup
│   ├── errors.py            # Error handlers
│   └── logging_config.py    # Logging setup
├── .env.example             # Environment variable template
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
└── main.py                 # Entry point
```

### API Architecture

#### Routers

The API is organized into multiple routers:

1. **Public Router** (`/api`)
   - `/login` - Admin authentication
   - `/products` - List/get products (public)
   - `/categories` - List/get categories (public)

2. **Admin Router** (`/api/admin`)
   - Protected with JWT authentication
   - Product CRUD operations
   - Category CRUD operations
   - Image upload/management
   - Product variants

3. **Customers Router** (`/api/admin`)
   - Protected with JWT authentication
   - Customer CRUD operations

4. **Orders Router** (`/api/admin`)
   - Order creation (public for guest checkout)
   - Order management (protected)
   - Delivery area management (protected)

#### Authentication Flow

1. Admin logs in with password → `/api/login`
2. Backend validates against Supabase admin user
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token sent in `Authorization: Bearer <token>` header
6. Backend validates token on protected routes

#### CORS Configuration

Located in `backend/app/config.py`:

```python
essential_origins = {
    "http://localhost:3000",      # Vite dev server
    "http://localhost:5173",      # Alternative Vite port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://beta.azhar.store",   # Production storefront
    "https://admin.azhar.store",  # Production admin
    "https://azhar.store",
    "https://az-rosy.vercel.app",
}
```

---

## Database Schema

### Core Tables

Based on the Supabase database:

1. **admin_users**
   - Admin authentication
   - Single admin user (singleton pattern)

2. **products**
   - Product catalog
   - Fields: name, description, price, stock_quantity, category_id
   - Relationships: belongs to category, has many images/variants

3. **categories**
   - Product categorization
   - Simple name-based categories

4. **product_images**
   - Product image storage
   - Supabase Storage integration
   - Primary image designation

5. **product_variants**
   - Product variations (size, color, etc.)
   - Optional variant images

6. **customers**
   - Customer contact information
   - Used for guest checkout (not user accounts)

7. **orders**
   - Order records
   - Status tracking (PENDING, SHIPPED, DELIVERED, CANCELLED)

8. **order_items**
   - Junction table for orders and products
   - Stores price at time of purchase

9. **delivery_areas**
   - Geographic delivery zones
   - Delivery fee configuration

10. **app_settings**
    - Key-value store for app configuration
    - Customizable messages, payment methods, etc.

---

## Current State & Missing Features

### ✅ Fully Implemented

- **Admin Panel**: Complete CRUD for products, categories, customers, orders
- **Authentication**: JWT-based admin login
- **Product Management**: Images, variants, stock tracking
- **Order Management**: Status updates, customer info
- **Settings**: Delivery areas, payment methods, customizable messages
- **Internationalization**: English + Arabic support
- **Local Development**: Now fully supported with dual routing

### ⚠️ Placeholder/Incomplete

- **Storefront**: Currently just a placeholder component (`StoreFront.jsx`)
  - No product browsing UI
  - No shopping cart
  - No checkout flow
  - No customer-facing features

### 🔒 Security Considerations

**Current Security:**
- ✅ JWT authentication for admin routes
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Protected routes in frontend
- ⚠️ Admin panel accessible via `admin.azhar.store` (requires Cloudflare IP restriction)

**Recommended Additions:**
- 2FA/MFA for admin login
- Rate limiting on login endpoint
- Session timeout/refresh tokens
- Audit logging for admin actions
- CSP (Content Security Policy) headers

---

## Development Workflow

### Local Development Setup

See [`LOCAL_DEVELOPMENT.md`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/LOCAL_DEVELOPMENT.md) for detailed setup instructions.

**Quick Start:**

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env  # Configure environment variables
uvicorn main:app --reload --port 8000

# Frontend (in new terminal)
cd frontend
npm install
cp .env.example .env  # Optional: configure VITE_API_BASE_URL
npm run dev
```

Access admin at: `http://localhost:3000/admin`

### Deployment

**Frontend (Cloudflare Pages):**
- Automatic deployment from Git
- Build command: `npm run build`
- Output directory: `dist`
- Domains: `beta.azhar.store`, `admin.azhar.store`

**Backend (Dokploy):**
- Docker-based deployment
- Environment variables managed in Dokploy dashboard
- Automatic deployments via GitHub webhooks

---

## Next Steps: Storefront Development

### Recommended Approach

1. **Design Phase**
   - Create wireframes/mockups for storefront
   - Define user flows (browse → cart → checkout)
   - Plan mobile-first responsive design

2. **Component Development**
   - Product grid/list components
   - Product detail page
   - Shopping cart (Context API or state management)
   - Checkout flow (multi-step modal as per AGENTS.md)

3. **API Integration**
   - Use existing public endpoints (`/api/products`, `/api/categories`)
   - Implement guest checkout (`/api/admin/orders`)
   - Customer creation for order tracking

4. **Features to Implement**
   - Product search and filtering
   - Category navigation
   - Shopping cart persistence (localStorage)
   - Guest checkout with delivery area selection
   - Order confirmation and tracking

5. **UI/UX Enhancements**
   - Follow design system from AGENTS.md
   - Implement animations (Framer Motion recommended)
   - Ensure mobile responsiveness
   - Add loading states and error handling

### Technical Considerations

- **State Management**: Consider adding Zustand or Redux if cart logic becomes complex
- **Image Optimization**: Implement lazy loading for product images
- **SEO**: Add meta tags, structured data for products
- **Performance**: Code splitting, lazy loading routes
- **Analytics**: Consider adding tracking (Google Analytics, etc.)

---

## Key Files Reference

### Configuration Files

- [`frontend/vite.config.js`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/frontend/vite.config.js) - Vite configuration
- [`frontend/tailwind.config.js`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/frontend/tailwind.config.js) - Tailwind CSS config
- [`backend/app/config.py`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/backend/app/config.py) - Backend configuration & CORS

### Core Application Files

- [`frontend/src/App.jsx`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/frontend/src/App.jsx) - Main routing logic
- [`frontend/src/services/api.js`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/frontend/src/services/api.js) - API service layer
- [`backend/main.py`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/backend/main.py) - FastAPI app initialization
- [`backend/app/api.py`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/backend/app/api.py) - API route handlers

### Documentation

- [`AGENTS.md`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/AGENTS.md) - Comprehensive SRS document
- [`LOCAL_DEVELOPMENT.md`](file:///c:/Users/m3332/OneDrive/المستندات/Hasan/Hasan/Development/az/az/az/LOCAL_DEVELOPMENT.md) - Local development guide

---

## Summary

AzharStore is a well-architected e-commerce platform with a **complete admin panel** and **robust backend API**. The distributed architecture provides good separation of concerns and scalability. 

**Strengths:**
- ✅ Modern tech stack (React, FastAPI, Supabase)
- ✅ Complete admin functionality
- ✅ Proper authentication and authorization
- ✅ Good code organization
- ✅ Internationalization support
- ✅ Now supports local development

**Next Priority:**
- 🎯 Build the customer-facing storefront
- 🎯 Implement shopping cart and checkout
- 🎯 Add product browsing and search

The foundation is solid and ready for storefront development! 🚀
