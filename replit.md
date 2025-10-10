# Mortgage Broker Admin Portal

## Overview

The Mortgage Broker Admin Portal is a Next.js-based web application that serves as an administrative interface for managing mortgage broker operations. The platform facilitates connections between loan applicants, lenders, and internal team members. It handles the complete workflow from loan application submission through lender matching and term sheet management.

**Core Purpose**: Enable mortgage broker employees to manage loan applications, coordinate with lenders, match applicants with appropriate loan products, and track term sheets through the lending process.

**Technology Stack**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS 4, shadcn/ui components, React Query, Axios, Zod validation, React Hook Form.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- Next.js 15 with App Router architecture for file-based routing
- Server and client components pattern with "use client" directives for interactive components
- Middleware-based authentication flow protecting `/portal` routes

**State Management**
- React Query (TanStack Query) for server state management, data fetching, and caching
- Custom hooks pattern for all API interactions
- React Context API for user session management (UserProvider)

**Form Management**
- React Hook Form for form state and validation
- Zod schemas for runtime type validation
- Custom Field component for consistent form field rendering with error handling

**UI Component Library**
- shadcn/ui (Radix UI primitives) for accessible, customizable components
- TailwindCSS 4 with CSS variables for theming
- Custom component variants using class-variance-authority
- Montserrat font family for consistent typography

**Design Patterns**
- Separation of concerns: hooks for logic, components for presentation, services for API calls
- Custom reusable components (CustomSelect, CustomDropdown, CustomPagination)
- Sheet components for detail views (lender, loan, team member, term sheet details)
- Loading skeletons and empty states for improved UX
- Debounced search inputs for performance optimization

### Backend Integration

**API Communication**
- Axios instance with centralized configuration
- Base URL environment switching (dev, test, prod)
- Cookie-based authentication with `withCredentials: true`
- Standardized error handling with custom ApiError interface
- 10-second request timeout

**Authentication Flow**
1. Cookie-based session management (`authToken`)
2. Middleware redirects unauthenticated users from `/portal` routes
3. Login/logout mutations with React Query
4. Invitation-based registration for employees and lenders via token URLs

**API Service Layer**
Services organized by domain:
- `auth.service.ts`: Login/logout endpoints
- `employee/*.service.ts`: Employee CRUD, invitations, registration, dashboard stats
- `lender/*.service.ts`: Lender CRUD, invitations, registration
- `quotes/*.service.ts`: Loan application retrieval with filtering/pagination
- `loan-products/*.service.ts`: Loan product matching and retrieval
- `loan-connections/*.service.ts`: Creating matches between quotes and lenders, term sheet management

**Data Fetching Strategy**
- Paginated responses with standardized `PaginatedResponse<T>` type
- URL search params for filter state persistence
- Optimistic updates and cache invalidation patterns
- Conditional queries with `enabled` flags

### Data Models

**Core Entities**
- **Employee**: Admin portal users with roles (admin/employee)
- **Lender**: External lending partners with loan products
- **Quote**: Loan applications from end users containing applicant info and loan details
- **LoanProduct**: Lender offerings with specific criteria (loan amounts, citizenship, states, etc.)
- **TermSheet**: Connections between quotes and matched loan products
- **LoanConnection**: The matching record linking users, quotes, lenders, and products

**Type Safety**
- TypeScript interfaces for all API responses
- Zod schemas for form validation
- Shared types in `@types` directory for cross-cutting concerns

### Page Structure

**Public Routes**
- `/` - Login page
- `/join` - Employee registration via invitation token
- `/join/lender` - Lender registration via invitation token

**Protected Portal Routes** (require authentication)
- `/portal` - Dashboard with statistics overview
- `/portal/applications` - View and manage loan applications with filtering
- `/portal/lenders` - Manage lender accounts and invitations
- `/portal/team` - Manage internal team members
- `/portal/term-sheets` - Track term sheets by status
- `/portal/products` - View loan products (placeholder implementation)

### Key Features

**Authentication & Authorization**
- Cookie-based session management
- Middleware-protected routes
- Invitation-only registration for employees and lenders
- Role-based access (admin/employee distinctions in data model)

**Application Management**
- Search and filter loan applications
- View detailed application information in side sheets
- Match applications with best-fit lender products
- Create loan connections to send applications to lenders

**Lender Management**
- Invite new lenders via email
- View lender details and associated loan products
- Enable/disable lender accounts
- Delete lender records

**Team Management**
- Invite new team members
- View team member details
- Manage employee status
- Delete employee accounts

**Term Sheet Tracking**
- Filter term sheets by status (awaiting, pending, signed, closed, available)
- Search term sheets by applicant or property information
- View comprehensive term sheet details including quote, lender, and loan product information

**Dashboard Analytics**
- Total lenders count
- Total loan products count
- Total applicants count
- Matches made count
- Total term sheets count

## External Dependencies

**UI & Styling**
- `@radix-ui/*`: Accessible component primitives (avatar, checkbox, dialog, dropdown, select, switch, tabs)
- `tailwindcss`: Utility-first CSS framework
- `next-themes`: Dark mode support (infrastructure present)
- `lucide-react`: Icon library
- `class-variance-authority`: Component variant management
- `tailwind-merge` & `clsx`: Conditional className utilities

**Data Fetching & Forms**
- `@tanstack/react-query`: Server state management and caching
- `axios`: HTTP client for API requests
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Form validation integration
- `zod`: Runtime schema validation

**Utilities**
- `sonner`: Toast notifications
- `embla-carousel-react`: Carousel component (available but not actively used)

**Backend API**
- Production: `https://api.themortgageplatform.com/api/v1`
- Test: `https://mortgage-broker-apis-eta.vercel.app/api/v1`
- Development: `http://localhost:4000/api/v1`

The API provides RESTful endpoints for all CRUD operations, authentication, and business logic related to mortgage broker operations. No database is directly accessed from the frontend; all data operations go through the API layer.