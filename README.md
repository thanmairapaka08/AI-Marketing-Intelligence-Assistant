# AI Marketing Intelligence Assistant

## Project Overview
AI Marketing Intelligence Assistant is a full-stack web application that analyzes websites and provides SEO performance insights, scores, and improvement recommendations.

## Technologies Used
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, FastAPI
- **Database:** SQLite
- **API:** REST API
- **Tools:** GitHub, VS Code

## Features
- Website URL submission
- Automated website SEO analysis
- Overall SEO score
- Title and meta description analysis
- Broken link detection
- Image alt text analysis
- Heading structure analysis
- Canonical tag analysis
- SEO improvement recommendations
- Audit report dashboard

## How to Run

### Backend
```bash
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
npm install
npm run dev
```

Open: http://127.0.0.1:5173

## Application Workflow
1. User enters a website URL.
2. Frontend sends an audit request to FastAPI.
3. Backend analyzes website SEO factors.
4. Results are stored in SQLite.
5. Frontend displays SEO scores and recommendations.

## Project Status
Core SEO auditing and report display are functional. Additional features, including report exports, require further testing.

## Future Enhancements
- AI-generated marketing recommendations
- Improved website crawling
- Advanced SEO analytics
- Downloadable reports
- Deployment to cloud infrastructure
Demo video:https://drive.google.com/file/d/13fgBg94aQejyv9rBoLDTgwMgvfSO99Nb/view?usp=sharing

