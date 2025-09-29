# Mortgage Broker Admin Portal

## Overview
This is a Next.js 15 application for a mortgage broker admin portal, featuring a modern login system and comprehensive admin dashboard. The application has been successfully configured to run in the Replit environment.

## Project Architecture
- **Framework**: Next.js 15 with App Router
- **UI Library**: Tailwind CSS with Radix UI components
- **Type Safety**: TypeScript
- **Build Tool**: Next.js (without Turbopack due to Replit compatibility)
- **Port Configuration**: 5000 (required for Replit)

## Recent Changes (September 29, 2025)
- ✅ Successfully imported GitHub project to Replit
- ✅ Installed all dependencies via npm
- ✅ Configured Next.js for Replit environment (host header bypass, port 5000)
- ✅ Disabled Turbopack to fix compatibility issues
- ✅ Set up Frontend workflow on port 5000
- ✅ Configured deployment settings for autoscale
- ✅ Verified both login page (/) and admin portal (/portal) are working

## User Preferences
- Frontend-only application (no backend currently configured)
- Uses mock/placeholder functionality for demonstration
- Prefers modern UI with Tailwind CSS styling
- Requires responsive design for all screen sizes

## Key Features
- **Login Page (/)**: Professional login form with email/password fields, social login options (Google/Facebook), and form validation
- **Admin Portal (/portal)**: Complete dashboard with:
  - Navigation for Dashboard, Lenders, Products, Applications
  - Statistics cards showing metrics
  - API endpoints documentation
  - Action buttons for database operations

## Environment Configuration
- **Development**: `npm run dev` on 0.0.0.0:5000
- **Production**: Configured for autoscale deployment
- **Host Configuration**: Properly configured for Replit proxy support
- **Cross-origin Requests**: Enabled for *.replit.dev domains

## Dependencies
- Next.js 15.5.3 with React 19
- Radix UI components for professional UI elements
- Tailwind CSS for styling
- TypeScript for type safety
- Form validation with react-hook-form and zod

## Project Status
✅ **READY FOR USE** - All setup complete, application running successfully in Replit environment.