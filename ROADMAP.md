# GarageOS Roadmap

> "Shopify for Auto Repair" — Mobile-first, AI-powered shop management OS

## Vision

GarageOS empowers auto repair shops in Thailand and Southeast Asia to digitize their operations. Mechanics capture vehicle photos, AI detects issues, customers approve repairs with visual evidence, and shops run more profitably.

---

## Current Status

### Completed
- [x] **Monorepo scaffold** — Turborepo with shared, ui, app, site, db packages
- [x] **Domain types** — Full type system (Users, Shops, Vehicles, JobCards, Parts, AI Inspection, Messaging)
- [x] **UI component library** — 15+ components with Tailwind v4 and dark mode
- [x] **Marketing site** — Landing page with features, pricing, CTA
- [x] **Database schema** — Drizzle ORM with full relational model (SQLite/Supabase)

### In Progress
- [ ] **Database schema/RLS alignment** — Configure Supabase Row Level Security policies

### Todo

---

## Phase 1: Foundation (Current)

### 1.1 Database & Auth
- [ ] Configure Supabase project with environment variables
- [ ] Set up RLS policies for multi-tenant isolation (shop-based)
- [ ] Implement Supabase Auth (email/password, phone OTP for Thailand)
- [ ] Create auth callbacks and session handling
- [ ] Add middleware for auth protection

### 1.2 Core API Routes
- [ ] `/api/auth/*` — Authentication endpoints
- [ ] `/api/shops/*` — Shop CRUD
- [ ] `/api/vehicles/*` — Vehicle management
- [ ] `/api/customers/*` — Customer management
- [ ] `/api/job-cards/*` — Job card workflow

### 1.3 App Shell
- [ ] Dashboard layout with sidebar navigation
- [ ] Role-based routing (owner, manager, mechanic, client)
- [ ] Global state management (Zustand store)
- [ ] Loading states and error boundaries

---

## Phase 2: Core Features

### 2.1 Job Card Workflow
- [ ] Create job card with vehicle selection
- [ ] Status transitions (inspection → diagnosed → parts_ordered → in_progress → pending_approval → completed)
- [ ] Assign mechanics to job cards
- [ ] Add photos and AI inspection trigger
- [ ] Cost estimation and time tracking

### 2.2 AI Inspection
- [ ] Photo upload with compression
- [ ] AI vision analysis (Claude 4 Vision / Google Vision)
- [ ] Damage detection with severity scoring
- [ ] Generate inspection report with photo evidence
- [ ] Customer-facing visual report

### 2.3 Vehicle & Customer Management
- [ ] Vehicle registration with license plate, VIN
- [ ] Customer database with contact info
- [ ] Vehicle history and service records
- [ ] Search and filter functionality

### 2.4 Parts & Inventory
- [ ] Parts catalog with categories
- [ ] Stock tracking and alerts
- [ ] Supplier management
- [ ] Parts usage on job cards
- [ ] Auto-reorder suggestions

---

## Phase 3: Customer Experience

### 3.1 Customer Messaging
- [ ] Multi-channel support (LINE, WhatsApp, SMS)
- [ ] Automated status updates
- [ ] Repair approval requests
- [ ] Payment reminders
- [ ] Ready for pickup notifications

### 3.2 Customer Portal
- [ ] Vehicle history view
- [ ] Pending approvals
- [ ] Invoice viewing and payment
- [ ] Service reminders

### 3.3 Invoicing
- [ ] Invoice generation from job cards
- [ ] Tax calculation
- [ ] Payment recording
- [ ] Invoice status tracking

---

## Phase 4: Intelligence

### 4.1 AI Diagnostics
- [ ] Symptom-based diagnosis suggestions
- [ ] Possible causes ranked by likelihood
- [ ] Recommended actions
- [ ] Urgency scoring

### 4.2 Predictive Maintenance
- [ ] Mileage-based reminders
- [ ] Time-based reminders
- [ ] Service history analysis
- [ ] Customer retention triggers

### 4.3 Analytics Dashboard
- [ ] Revenue metrics
- [ ] Job completion rates
- [ ] Parts inventory turnover
- [ ] Mechanic productivity

---

## Phase 5: Scale

### 5.1 Multi-Shop Management
- [ ] Shop switching interface
- [ ] Cross-shop reporting
- [ ] Staff management per shop

### 5.2 Integrations
- [ ] LINE Official Account integration
- [ ] Payment gateway (PromptPay, QR)
- [ ] Accounting software sync

### 5.3 White-label / Enterprise
- [ ] Custom branding per shop
- [ ] API access for third-party integrations
- [ ] Dedicated account management

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind v4 |
| UI Components | Custom component library (@garageos/ui) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Database | SQLite (dev), Supabase (prod) |
| ORM | Drizzle |
| Auth | Supabase Auth |
| AI | Anthropic Claude 4, Google AI |
| Messaging | LINE, WhatsApp, SMS (Twilio) |
| File Storage | Supabase Storage |
| Deployment | Vercel (frontend), Supabase (backend) |

---

## File Structure

```
garage-os/
├── packages/
│   ├── app/              # Main application (shop dashboard)
│   │   └── src/
│   │       ├── app/      # Next.js App Router pages
│   │       │   ├── (auth)/
│   │       │   ├── (dashboard)/
│   │       │   └── api/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── lib/
│   │       └── stores/
│   ├── site/             # Marketing website
│   ├── ui/               # Shared UI components
│   ├── shared/           # Domain types & utilities
│   └── db/               # Database schema & client
├── ROADMAP.md
└── package.json
```

---

## Milestones

| Milestone | Description | Target |
|-----------|-------------|--------|
| M1 | Foundation | Auth, API routes, app shell |
| M2 | Job Cards | Full workflow with AI inspection |
| M3 | Inventory | Parts, suppliers, stock alerts |
| M4 | Messaging | Multi-channel customer updates |
| M5 | Invoicing | Invoice generation and tracking |
| M6 | Intelligence | AI diagnostics, predictive maintenance |
| M7 | Scale | Multi-shop, analytics |

---

## Priorities

1. **Shop owners** need to see job status at a glance
2. **Mechanics** need fast photo capture and AI assistance
3. **Customers** need transparency and easy approvals
4. **Inventory** needs to prevent stockouts on critical parts

---

*Last updated: 2026-03-26*
