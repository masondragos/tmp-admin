# Mortgage Broker Admin Portal

## Overview
Next.js 15 application for a mortgage broker admin portal with a comprehensive multi-portal chat system for communication between admins, applicants, and lenders. Features real-time messaging, role-based access control, and secure authentication.

## Project Architecture
- **Framework**: Next.js 15 with App Router and Custom Server
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: NextAuth with JWT-based sessions
- **Real-time**: Socket.io WebSocket server
- **UI Library**: Tailwind CSS with Radix UI components
- **Type Safety**: TypeScript
- **Port Configuration**: 5000 (required for Replit)

## Recent Changes (October 1, 2025)
### Phase 1 Complete - Real-Time Chat System ✅
- ✅ Set up PostgreSQL database with Prisma ORM
- ✅ Created comprehensive database schema (users, conversations, participants, messages, message_reads)
- ✅ Implemented NextAuth authentication with role-based access (ADMIN, APPLICANT, LENDER)
- ✅ Built shared chat UI components (ChatList, MessagePane, MessageComposer, ChatShell)
- ✅ Created secure API routes for conversations with role-based authorization
- ✅ Implemented Socket.io WebSocket server for real-time messaging
- ✅ Added JWT-based socket authentication with token endpoint
- ✅ Created test users for all roles (admin, applicants, lenders)
- ✅ **Built admin portal chat interface** at /admin/chat with participant selection
- ✅ **Built applicant portal chat interface** at /applicant/chat with admin contact
- ✅ **Implemented typing indicators** with real-time emission and display
- ✅ **Implemented read receipts** with checkmark icons (delivered vs read)
- ✅ **Fixed critical security issues**: ADMIN-only /api/users, proper socket lifecycle management
- ✅ **Optimized real-time flow**: Messages sent via sockets, proper cleanup on conversation switch

### Previous Changes (September 29, 2025)
- ✅ Successfully imported GitHub project to Replit
- ✅ Configured Next.js for Replit environment (port 5000)
- ✅ Set up Frontend workflow with custom server
- ✅ Configured deployment settings for autoscale

## Authentication & Authorization
- **NextAuth Integration**: Credential-based authentication with bcrypt password hashing
- **Role-Based Access**: 
  - Admins can create conversations with applicants or lenders
  - Applicants can create conversations with admins only
  - Lenders cannot create conversations (invited by admins in Phase 2)
- **Route Protection**: Middleware enforces role-based access to /admin, /applicant, /lender routes
- **Socket Authentication**: JWT tokens issued via /api/socket/token for WebSocket connections

## Database Schema
- **Users**: id, email, password, name, role (ADMIN/APPLICANT/LENDER)
- **Conversations**: id, type, status, createdBy, timestamps
- **ConversationParticipants**: Many-to-many relationship with join/leave tracking
- **Messages**: id, conversationId, senderId, content, attachments, timestamps
- **MessageReads**: Track read receipts for each message per user

## Chat System Components
### Shared UI Components
- **ChatList**: Displays conversations with last message preview, supports multi-party conversations
- **MessagePane**: Shows messages with auto-scroll, sender avatars, timestamps, typing indicators (animated dots), read receipts (checkmarks)
- **MessageComposer**: Text input with send button, typing indicator emission (2s timeout), Enter to send, Shift+Enter for new line
- **ChatShell**: Layout container combining all components with conversation header

### API Routes
- `GET /api/conversations` - List all conversations for current user
- `POST /api/conversations` - Create new conversation with participant validation
- `GET /api/conversations/[id]/messages` - Fetch messages for a conversation
- `POST /api/conversations/[id]/messages` - Send new message with transaction
- `PUT /api/conversations/[id]/read` - Mark messages as read
- `GET /api/socket/token` - Get JWT token for Socket.io authentication

### WebSocket Events
- `join:conversation` - Join conversation room
- `leave:conversation` - Leave conversation room
- `message:send` - Send message in real-time
- `message:new` - Receive new message
- `typing:start` / `typing:stop` - Typing indicators
- `message:read` - Read receipt notifications

## Test Users
All test users have password: `password123`
- Admin: `admin@themortgageplatform.com`
- Applicant 1: `john.doe@example.com`
- Applicant 2: `jane.smith@example.com`
- Lender 1: `lender@bankone.com`
- Lender 2: `lender@creditunion.com`

## Environment Configuration
- **Development**: `npm run dev` runs custom server with Socket.io on 0.0.0.0:5000
- **Production**: Configured for autoscale deployment
- **Environment Variables**: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

## Key Features
- **Authentication**: Secure login with role-based access control
- **Real-time Messaging**: WebSocket-powered instant messaging with socket events
- **Multi-party Conversations**: Support for 1-on-1 and group conversations
- **Read Receipts**: Visual checkmarks (single = delivered, double-blue = read) with optimistic updates
- **Typing Indicators**: Animated dots showing when other users are typing (2s timeout)
- **Secure Authorization**: Participant validation on all operations, ADMIN-only user access
- **Socket Lifecycle Management**: Proper cleanup using refs and isCancelled flags to prevent memory leaks

## Next Steps - Future Enhancements
- [ ] Implement file upload and attachment handling for messages
- [ ] Add message search and conversation filtering functionality
- [ ] Add user notifications for new messages
- [ ] Implement message editing and deletion
- [ ] Add emoji picker and reactions
- [ ] Set NEXTAUTH_SECRET environment variable (currently showing warning)

## Phase 2 - Lender Integration (Future)
- [ ] Create lender portal structure (/lender routes and layouts)
- [ ] Implement admin invitation workflow to add lenders to conversations
- [ ] Build lender chat interface with document panel
- [ ] Add audit logging and admin controls

## Project Status
✅ **PHASE 1 COMPLETE** - Full real-time chat system is operational with:
- Admin and applicant portals with working chat interfaces
- Real-time messaging via WebSocket events (message:send → message:new)
- Typing indicators with 2s timeout and proper user filtering
- Read receipts with visual checkmarks and optimistic state updates
- Race-safe socket lifecycle management preventing memory leaks
- Secure role-based authorization on all endpoints and socket events

**Ready for production deployment!** Optional enhancements: file upload, search/filtering, and setting NEXTAUTH_SECRET.