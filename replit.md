# Jaguar SDK - Open Source AGI Platform

## Overview

Jaguar SDK is the world's first open source Ethically Generated Intelligence platform that empowers conscious creators to manifest their dreams through intelligent AI agents. The project represents more than software—it's a movement toward conscious technology that embodies permaculture ethics: Earth Care, People Care, and Fair Share.

Built as a comprehensive Next.js application, Jaguar SDK provides a full-featured AI chatbot interface with advanced capabilities including agent creation, document collaboration, and real-time AI interactions. The platform serves as both a production-ready AI interface and a development framework for building conscious AI applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses Next.js 15 with App Router, leveraging React Server Components and client-side interactivity where needed. The UI is built with Tailwind CSS and shadcn/ui components, featuring a modern dark theme with Jaguar brand colors (black and gold). The design system includes custom fonts (Lato for headlines, Open Sans for body text) and comprehensive animation support through Framer Motion.

Key frontend patterns include:
- Server-side rendering for performance and SEO
- Client-side state management with custom hooks and context
- Real-time chat interface with streaming responses
- Responsive design optimized for mobile and desktop
- Artifact system for displaying and editing generated content (code, text, images, spreadsheets)

### Backend Architecture
The backend follows a serverless architecture pattern using Next.js API routes and server actions. Core services include:

- **Authentication**: NextAuth.js with support for multiple providers and guest sessions
- **AI Integration**: AI SDK for provider-agnostic model interactions
- **Real-time Communication**: Streaming responses and WebSocket-like functionality
- **File Handling**: Support for attachments and blob storage integration

The application uses a modular provider system that abstracts different AI services, currently featuring integration with OpenWebUI and xAI models. The ethics engine ensures all AI interactions align with permaculture principles.

### Data Storage Solutions
The primary database is PostgreSQL, managed through Drizzle ORM for type-safe database operations. The schema includes:

- **Chat Management**: Messages, conversations, and user sessions
- **Document System**: Collaborative editing with version control
- **User Management**: Authentication, preferences, and access control
- **Analytics**: Usage tracking and performance metrics

Database migrations are automated and the system supports both local development (better-sqlite3) and production PostgreSQL deployments.

### Authentication and Authorization
NextAuth.js provides flexible authentication with support for:
- Email/password registration and login
- Guest sessions for anonymous users
- Session persistence and management
- Role-based access control (user types: guest, standard, premium)

The middleware system handles route protection and authentication flows, with temporary bypasses for landing page demonstrations.

## External Dependencies

### AI Services
- **OpenWebUI Integration**: Primary AI backend at `ai.thespatialnetwork.net` providing custom Jaguar models (jaguar, jaguar-pro, nature, codewriter)
- **xAI Provider**: Alternative AI provider integration through `@ai-sdk/xai`
- **AI SDK**: Vercel's AI SDK for unified model interactions and streaming

### Infrastructure Services
- **Vercel Platform**: Deployment and hosting with edge functions
- **Vercel Blob**: File storage for attachments and generated assets
- **Vercel Analytics**: Performance monitoring and user analytics
- **Vercel OTel**: Observability and tracing (currently disabled)

### Development Dependencies
- **Drizzle Kit**: Database migration and schema management
- **Playwright**: End-to-end testing framework
- **Biome**: Linting and code formatting
- **ESLint**: Additional code quality checks with Next.js optimizations

### Third-party Integrations
- **Sonner**: Toast notifications
- **React Hook Form**: Form state management
- **SWR**: Data fetching and caching
- **CodeMirror**: Code editing capabilities
- **ProseMirror**: Rich text editing
- **React Data Grid**: Spreadsheet functionality

The platform is designed for extensibility, with clear separation between core functionality and external integrations, enabling easy addition of new AI providers, storage backends, and third-party services.