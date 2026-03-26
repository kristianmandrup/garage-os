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
- [x] **Supabase Auth** — Google OAuth via Supabase
- [x] **Core API Routes** — Full CRUD for shops, vehicles, customers, job-cards, parts, suppliers, invoices
- [x] **Dashboard** — Real-time stats, recent jobs, inventory alerts
- [x] **AI Inspection** — Gemini Flash vision analysis with damage detection
- [x] **Parts & Inventory** — Stock tracking, low stock alerts, supplier management
- [x] **Invoice Generation** — Create invoices from job cards, payment tracking
- [x] **RLS Policies** — Supabase Row Level Security for multi-tenant isolation
- [x] **Customer Messaging** — Multi-channel (LINE, WhatsApp, SMS, In-App) with Thai templates

### In Progress
- [ ] **Customer-facing reports** — Shareable inspection reports

### Todo
- Predictive maintenance & reminders
- Analytics dashboard

---

## Phase 1: Foundation (Complete)

### 1.1 Database & Auth
- [x] Configure Supabase project with environment variables
- [x] Set up RLS policies for multi-tenant isolation (shop-based)
- [x] Implement Supabase Auth (email/password, phone OTP for Thailand)
- [x] Create auth callbacks and session handling
- [x] Add middleware for auth protection

### 1.2 Core API Routes
- [x] `/api/auth/*` — Authentication endpoints
- [x] `/api/shops/*` — Shop CRUD
- [x] `/api/vehicles/*` — Vehicle management
- [x] `/api/customers/*` — Customer management
- [x] `/api/job-cards/*` — Job card workflow

### 1.3 App Shell
- [x] Dashboard layout with sidebar navigation
- [x] Role-based routing (owner, manager, mechanic, client)
- [x] Global state management (Zustand store)
- [x] Loading states and error boundaries

---

## Phase 2: Core Features

### 2.1 Job Card Workflow
- [x] Create job card with vehicle selection
- [x] Status transitions (inspection → diagnosed → parts_ordered → in_progress → pending_approval → completed)
- [x] Assign mechanics to job cards
- [x] Add photos and AI inspection trigger
- [x] Cost estimation and time tracking

### 2.2 AI Inspection
- [x] Photo upload with compression
- [x] AI vision analysis (Claude 4 Vision / Google Vision)
- [x] Damage detection with severity scoring
- [x] Generate inspection report with photo evidence
- [ ] Customer-facing visual report

### 2.3 Vehicle & Customer Management
- [x] Vehicle registration with license plate, VIN
- [x] Customer database with contact info
- [x] Vehicle history and service records
- [x] Search and filter functionality

### 2.4 Parts & Inventory
- [x] Parts catalog with categories
- [x] Stock tracking and alerts
- [x] Supplier management
- [x] Parts usage on job cards
- [ ] Auto-reorder suggestions

---

## Phase 3: Customer Experience

### 3.1 Customer Messaging
- [x] Multi-channel support (LINE, WhatsApp, SMS)
- [x] Automated status updates
- [x] Repair approval requests
- [x] Payment reminders
- [x] Ready for pickup notifications

### 3.2 Customer Portal
- [ ] Vehicle history view
- [ ] Pending approvals
- [ ] Invoice viewing and payment
- [ ] Service reminders

### 3.3 Invoicing
- [x] Invoice generation from job cards
- [ ] Tax calculation
- [ ] Payment recording
- [x] Invoice status tracking

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
