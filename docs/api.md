# JobPilot — API Reference

Base URL: `http://localhost:5000/api`

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Table of Contents

- [Auth](#auth)
- [Resumes](#resumes)
- [Resume Versions](#resume-versions)
- [Applications](#applications)
- [Interviews](#interviews)
- [Interview Prep Topics](#interview-prep-topics)
- [ATS Score Checker](#ats-score-checker)
- [Job URL Importer](#job-url-importer)
- [Dashboard](#dashboard)
- [User Profile](#user-profile)

---

## Auth

### POST /auth/register
Register a new user account.

**Auth required:** No

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success response `201`:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-04-01T10:00:00.000Z"
  }
}
```

**Error responses:**
- `400` — Validation failed (missing fields, invalid email, short password)
- `409` — Email already in use

---

### POST /auth/login
Login and receive a JWT token.

**Auth required:** No

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success response `200`:**
```json
{
  "token": "<jwt_token>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error responses:**
- `400` — Validation failed
- `401` — Invalid email or password
- `429` — Too many requests (rate limited after 20 requests per 15 minutes)

---

### POST /auth/logout
Logout the current user. Token must be discarded client-side.

**Auth required:** Yes

**Success response `200`:**
```json
{
  "message": "Logged out successfully. Please delete the token on the client."
}
```

---

## Resumes

### POST /resumes
Create a new resume.

**Auth required:** Yes

**Request body:**
```json
{
  "name": "Software Engineer Resume",
  "template": "modern",
  "theme_config": {
    "primaryColor": "#2563eb",
    "fontColor": "#111827",
    "bgColor": "#ffffff",
    "font": "Inter, sans-serif"
  },
  "content": {
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+358 40 123 4567",
      "location": "Helsinki, Finland",
      "summary": "Software engineer with 3 years of experience.",
      "linkedin": "linkedin.com/in/johndoe",
      "github": "github.com/johndoe",
      "website": "johndoe.dev"
    },
    "experience": [],
    "education": [],
    "skills": [],
    "projects": [],
    "certifications": []
  },
  "section_order": ["personalInfo", "experience", "education", "skills", "projects", "certifications"]
}
```

**Success response `201`:** Full resume object

---

### GET /resumes
List all resumes for the authenticated user (excludes soft-deleted).

**Auth required:** Yes

**Success response `200`:** Array of resume objects

---

### GET /resumes/:id
Get a single resume by ID.

**Auth required:** Yes

**Success response `200`:** Full resume object including JSONB content

**Error responses:**
- `404` — Resume not found

---

### PUT /resumes/:id
Update resume fields. All fields are optional (COALESCE update).

**Auth required:** Yes

**Request body:** Any subset of `name`, `template`, `theme_config`, `content`, `section_order`

**Success response `200`:** Updated resume object

---

### DELETE /resumes/:id
Soft delete a resume (`is_deleted = true`).

**Auth required:** Yes

**Success response `200`:**
```json
{ "message": "Resume deleted successfully" }
```

---

### GET /resumes/:id/export/pdf
Download resume as a PDF file.

**Auth required:** Yes

**Success response `200`:** PDF file stream

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="Resume_Name_2026-05-01.pdf"
```

---

## Resume Versions

### POST /resumes/:id/versions
Save an immutable named snapshot of the current resume state.

**Auth required:** Yes

**Request body:**
```json
{ "version_name": "Software Engineer v1" }
```

**Success response `201`:** Version object

---

### GET /resumes/:id/versions
List all saved versions for a resume, ordered by most recent first.

**Auth required:** Yes

**Success response `200`:** Array of version objects including `content` field

---

### DELETE /resumes/:id/versions/:versionId
Permanently delete a saved version.

**Auth required:** Yes

**Success response `200`:**
```json
{ "message": "Version deleted successfully" }
```

---

## Applications

### POST /applications
Create a new job application.

**Auth required:** Yes

**Request body:**
```json
{
  "company": "Google",
  "role": "Software Engineer",
  "job_url": "https://careers.google.com/jobs/123",
  "location": "Helsinki, Finland",
  "salary": "€90,000",
  "notes": "Applied through LinkedIn",
  "resume_version_id": 1,
  "status": "wishlist"
}
```

**Success response `201`:** Application object

**Error responses:**
- `400` — Company and role are required, or invalid status

---

### GET /applications
List all applications for the authenticated user.

**Auth required:** Yes

**Query parameters:**
| Parameter | Type | Description |
|---|---|---|
| `status` | string | Filter by pipeline status |
| `search` | string | Search by company or role (case-insensitive) |
| `sort_by` | string | Sort field: `updated_at`, `created_at`, `company`, `role`, `status` |
| `order` | string | `asc` or `desc` (default: `desc`) |

**Success response `200`:** Array of application objects with `resume_version_name` joined

---

### GET /applications/:id
Get a single application.

**Auth required:** Yes

**Success response `200`:** Application object with `resume_version_name`

---

### PUT /applications/:id
Update application fields. All fields optional (COALESCE update).

**Auth required:** Yes

**Request body:** Any subset of `company`, `role`, `job_url`, `location`, `salary`, `notes`, `resume_version_id`

**Success response `200`:** Updated application object

---

### PATCH /applications/:id/status
Update the pipeline status with transition validation.

**Auth required:** Yes

**Request body:**
```json
{ "status": "applied" }
```

**Allowed transitions:**
```
wishlist  → applied, withdrawn
applied   → interview, rejected, withdrawn
interview → offer, rejected, withdrawn
offer     → withdrawn
rejected  → (none)
withdrawn → (none)
```

**Success response `200`:** Updated application object (with `applied_at` set if moving to `applied`)

**Error responses:**
- `400` — Invalid status or transition not allowed (includes `allowed` array in response)

---

### DELETE /applications/:id
Soft delete an application.

**Auth required:** Yes

**Success response `200`:**
```json
{ "message": "Application deleted successfully" }
```

---

## Interviews

### POST /interviews
Schedule a new interview linked to an application.

**Auth required:** Yes

**Request body:**
```json
{
  "application_id": 1,
  "interview_type": "technical",
  "scheduled_at": "2026-05-10T10:00:00Z",
  "location": "Google Meet — meet.google.com/abc-xyz",
  "notes": "Prepare system design questions"
}
```

`interview_type` values: `online`, `on-site`, `phone`, `technical`, `hr`

**Success response `201`:** Interview object

---

### GET /interviews
List all interviews for the authenticated user, ordered by `scheduled_at ASC`.

**Auth required:** Yes

**Success response `200`:** Array of interview objects with `company` and `role` joined from applications

---

### GET /interviews/:id
Get a single interview.

**Auth required:** Yes

**Success response `200`:** Interview object with `company` and `role`

---

### PUT /interviews/:id
Update interview details.

**Auth required:** Yes

**Request body:** Any subset of `interview_type`, `scheduled_at`, `location`, `notes`

**Success response `200`:** Updated interview object

---

### DELETE /interviews/:id
Cancel (hard delete) an interview.

**Auth required:** Yes

**Success response `200`:**
```json
{ "message": "Interview cancelled successfully" }
```

---

### POST /interviews/:id/checkin
Record the outcome of a past interview.

**Auth required:** Yes

**Request body:**
```json
{ "outcome": "waiting" }
```

`outcome` values: `offer`, `rejected`, `waiting`

**Outcome side effects:**
- `offer` → application status updated to `offer`
- `rejected` → application status updated to `rejected`
- `waiting` → application status unchanged

**Success response `200`:** Updated interview object with `checked_in: true`

**Error responses:**
- `400` — Invalid outcome value

---

### GET /interviews/pending-checkin
Get all past interviews that have not been checked in yet.
Used by the frontend on app load to trigger the check-in modal.

**Auth required:** Yes

**Success response `200`:** Array of interview objects with `company` and `role`

---

## Interview Prep Topics

### GET /interviews/:id/prep-topics
List all prep topics for an interview.

**Auth required:** Yes

**Success response `200`:** Array of prep topic objects ordered by `created_at ASC`

---

### POST /interviews/:id/prep-topics
Add a new prep topic to an interview.

**Auth required:** Yes

**Request body:**
```json
{ "topic": "Review system design — distributed caching" }
```

**Success response `201`:** Prep topic object

---

### PATCH /interviews/:id/prep-topics/:topicId
Update a prep topic (check off or rename).

**Auth required:** Yes

**Request body:**
```json
{ "is_completed": true }
```

or

```json
{ "topic": "Updated topic text" }
```

**Success response `200`:** Updated prep topic object

---

### DELETE /interviews/:id/prep-topics/:topicId
Delete a prep topic.

**Auth required:** Yes

**Success response `200`:**
```json
{ "message": "Prep topic deleted" }
```

---

## ATS Score Checker

### POST /ats/score
Score a resume version against a job description using keyword matching.

**Auth required:** Yes

**Request body:**
```json
{
  "resume_version_id": 1,
  "job_description": "We are looking for a software engineer with experience in React, Node.js, PostgreSQL and REST APIs..."
}
```

**Success response `200`:**
```json
{
  "score": 72,
  "matched": [
    { "keyword": "react", "weight": 1.5 },
    { "keyword": "node", "weight": 1.2 }
  ],
  "missing": ["typescript", "graphql", "docker"],
  "total": 18
}
```

**Scoring weights:**
| Section | Weight |
|---|---|
| Skills | 1.5× |
| Experience | 1.2× |
| Projects | 1.1× |
| Education | 1.0× |
| Certifications | 1.0× |
| Personal Info | 0.8× |

**Error responses:**
- `400` — `resume_version_id` or `job_description` missing
- `404` — Resume version not found

---

## Job URL Importer

### POST /import/url
Scrape a job posting URL and extract structured data to auto-fill the application form.

**Auth required:** Yes

**Request body:**
```json
{ "url": "https://company.com/jobs/software-engineer-123" }
```

**Success response `200`:**
```json
{
  "title": "Software Engineer",
  "company": "Acme Corp",
  "location": "Helsinki, Finland",
  "description": "We are looking for a software engineer...",
  "source": "json-ld"
}
```

`source` values:
- `json-ld` — extracted from structured data (most accurate)
- `og-tags` — extracted from Open Graph meta tags (fallback)
- `domain-fallback` — only domain name extracted (last resort)

**Error responses:**
- `400` — URL is required or invalid URL format
- `422` — Could not fetch or parse the job posting

---

## Dashboard

### GET /dashboard/stats
Get application counts per pipeline stage.

**Auth required:** Yes

**Success response `200`:**
```json
{
  "total": "12",
  "wishlist": "3",
  "applied": "5",
  "interview": "2",
  "offer": "1",
  "rejected": "1",
  "withdrawn": "0"
}
```

---

### GET /dashboard/alerts
Get past interviews that have not been checked in (overdue).

**Auth required:** Yes

**Success response `200`:** Array of interview objects with `company` and `role`

---

### GET /dashboard/charts
Get chart data for the dashboard visualisations.

**Auth required:** Yes

**Query parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `days` | number | `30` | Date range: `30`, `60`, or `90` |

**Success response `200`:**
```json
{
  "timeline": [
    { "date": "2026-04-01", "count": "3" }
  ],
  "funnel": [
    { "status": "applied", "count": "5" }
  ],
  "outcomes": [
    { "outcome": "offer", "count": "1" }
  ]
}
```

---

### GET /dashboard/activities
Get paginated activity feed.

**Auth required:** Yes

**Query parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | number | `20` | Number of activities to return |
| `offset` | number | `0` | Pagination offset |

**Success response `200`:** Array of activity objects ordered by `created_at DESC`

```json
[
  {
    "id": 1,
    "user_id": 1,
    "entity_type": "application",
    "entity_id": 3,
    "action": "status_changed",
    "metadata": { "from": "wishlist", "to": "applied" },
    "created_at": "2026-05-01T10:00:00.000Z"
  }
]
```

---

## User Profile

### GET /users/profile
Get the authenticated user's profile.

**Auth required:** Yes

**Success response `200`:**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "emailNotifications": true
    }
  }
}
```

---

### PUT /users/profile
Update name and/or email.

**Auth required:** Yes

**Request body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Success response `200`:**
```json
{ "data": { "id": 1, "name": "John Smith", "email": "johnsmith@example.com" } }
```

**Error responses:**
- `409` — Email already in use by another account

---

### POST /users/change-password
Change the authenticated user's password.

**Auth required:** Yes

**Request body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Success response `200`:**
```json
{ "success": true }
```

**Error responses:**
- `400` — Current password incorrect, or new password too short (min 6 chars)

---

### PUT /users/preferences
Update email notification preferences.

**Auth required:** Yes

**Request body:**
```json
{ "emailNotifications": false }
```

**Success response `200`:**
```json
{ "data": { "emailNotifications": false } }
```

---

### DELETE /users/me
Soft delete the authenticated user's account.

**Auth required:** Yes

**Success response `200`:**
```json
{ "success": true }
```

---

## Health Check

### GET /health
Check if the API is running.

**Auth required:** No

**Success response `200`:**
```json
{ "status": "ok", "message": "JobPilot API is running" }
```
