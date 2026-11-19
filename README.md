# AI Marketing Intelligence Assistant — Frontend

A modern, responsive React frontend for the AI Marketing Intelligence Assistant. The application helps users analyze websites, monitor SEO performance, compare competitors, and view AI-powered optimization recommendations.

## Tech Stack

- React with TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- TanStack Query
- FastAPI backend integration
- Vitest for frontend testing

## Features

- User registration and login
- Interactive SEO dashboard
- Website auditing and SEO scoring
- Five weighted SEO metrics
- AI-powered SEO recommendations
- Competitor analysis
- Website management
- Audit history and comparisons
- PDF, CSV, and JSON report exports
- Dark mode and responsive design

## Project Setup

### 1. Prerequisites

- Node.js
- npm
- Running FastAPI backend

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Ensure the backend allows requests from the frontend development origin.

### 4. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed in the terminal.

Default development URL for the current configuration:

http://localhost:8080

## Testing

Run frontend tests:

```bash
npm run test
```

Create a production build:

```bash
npm run build
```

## Backend Integration

The frontend communicates with the FastAPI backend for authentication, website analysis, SEO metrics, competitor comparisons, AI recommendations, and report generation.

Backend development URL:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

The backend must be running for features requiring API access.

## Project Structure

```text
screenshot-precision/
├── src/
│   ├── components/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   └── test/
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

## Project Status

Frontend pages and automated tests have been implemented. End-to-end integration with the backend should be verified before deployment.

## Purpose

Developed as part of a technical assessment to demonstrate modern frontend development, REST API integration, SEO analytics visualization, and AI-assisted website optimization.
