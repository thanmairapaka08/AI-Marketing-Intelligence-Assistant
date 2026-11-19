# Decisions — AI Marketing Intelligence Assistant

## 1. Architectural Decisions

**Single Repository:** The React frontend and FastAPI backend are maintained in one repository, with backend code inside `backend/`.

**Reason:** Simplifies evaluation, setup, testing, and submission.

**Frontend–Backend Communication:** REST APIs connect the React frontend to FastAPI. CORS origins are configurable using `FRONTEND_URL`.

**Reason:** Supports local development and different deployment environments.

**Authentication:** User information is obtained from the authenticated session rather than hardcoded values.

**Reason:** Ensures each user sees their own account information.

**Data Storage:** The initial backend used an in-memory store for rapid development. Persistent SQLite storage was subsequently prioritized.

**Reason:** In-memory storage simplifies prototyping, while persistence is needed to retain users and audit history. The final storage implementation must be verified.

## 2. Assumptions and Reasons

1. **Public websites:** Audits target publicly accessible URLs because private websites require additional authentication.
2. **SEO metrics:** Titles, descriptions, headings, image alt text, and internal links provide measurable indicators of basic SEO quality.
3. **SEO scoring:** A deterministic scoring system is suitable because the assignment does not provide specific metric weights.
4. **AI recommendations:** Rule-based suggestions are an acceptable fallback when an external AI service is unavailable.
5. **User-specific data:** Audits and reports should be associated with the authenticated user to prevent mixing information between accounts.

## 3. Unclear Requirements and Resolutions

| Unclear requirement | Resolution |
|---|---|
| Maximum crawling depth | Prioritize single-page analysis; extend crawling if required |
| SEO scoring weights | Use documented, consistent scoring rules |
| Required AI model | Use rule-based recommendations when no model is configured |
| Database technology | Prefer a simple local database for development |
| Report format | Support available export formats such as PDF, CSV, or JSON |

## 4. Three Decisions to Revisit

1. **Website Crawling:** Expand from single-page analysis to configurable multi-page crawling with broken-link detection.
2. **Database Architecture:** Evaluate PostgreSQL for production scalability and concurrent users.
3. **AI Recommendations:** Integrate Gemini or another LLM for more contextual SEO recommendations.

## 5. Engineering Priorities

The project prioritizes functional integration, reliable SEO analysis, secure authentication, automated testing, and accurate reporting.

The implementation avoids fabricated audit results and unnecessary complexity.

## Conclusion

These decisions balance development time, application functionality, and maintainability while identifying improvements for future development.
