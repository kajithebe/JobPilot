# JobPilot — Database Schema

## Tables Overview

| Table                 | Description                                 |
| --------------------- | ------------------------------------------- |
| users                 | Registered user accounts                    |
| resumes               | Resume records with JSONB content           |
| resume_versions       | Immutable named snapshots of a resume       |
| applications          | Job applications with pipeline status       |
| interviews            | Scheduled interviews linked to applications |
| interview_prep_topics | Prep checklist items per interview          |
| activities            | Activity log for dashboard feed             |
| email_logs            | Record of all reminder emails sent          |

---

## users

| Column       | Type         | Constraints      |
| ------------ | ------------ | ---------------- |
| id           | SERIAL       | PRIMARY KEY      |
| name         | VARCHAR(100) | NOT NULL         |
| email        | VARCHAR(255) | NOT NULL, UNIQUE |
| password     | VARCHAR(255) | NOT NULL         |
| avatar_url   | VARCHAR(500) |                  |
| notify_email | BOOLEAN      | DEFAULT true     |
| is_deleted   | BOOLEAN      | DEFAULT false    |
| created_at   | TIMESTAMP    | DEFAULT NOW()    |
| updated_at   | TIMESTAMP    | DEFAULT NOW()    |

---

## resumes

| Column        | Type         | Constraints                      |
| ------------- | ------------ | -------------------------------- |
| id            | SERIAL       | PRIMARY KEY                      |
| user_id       | INTEGER      | FK → users(id) ON DELETE CASCADE |
| name          | VARCHAR(255) | NOT NULL                         |
| template      | VARCHAR(50)  | NOT NULL, DEFAULT 'modern'       |
| theme_config  | JSONB        | NOT NULL, DEFAULT '{}'           |
| content       | JSONB        | NOT NULL, DEFAULT '{}'           |
| section_order | TEXT[]       | NOT NULL                         |
| is_deleted    | BOOLEAN      | DEFAULT false                    |
| created_at    | TIMESTAMP    | DEFAULT NOW()                    |
| updated_at    | TIMESTAMP    | DEFAULT NOW()                    |

---

## resume_versions

| Column        | Type         | Constraints                        |
| ------------- | ------------ | ---------------------------------- |
| id            | SERIAL       | PRIMARY KEY                        |
| resume_id     | INTEGER      | FK → resumes(id) ON DELETE CASCADE |
| user_id       | INTEGER      | FK → users(id) ON DELETE CASCADE   |
| version_name  | VARCHAR(255) | NOT NULL                           |
| template      | VARCHAR(50)  | NOT NULL                           |
| theme_config  | JSONB        | NOT NULL, DEFAULT '{}'             |
| content       | JSONB        | NOT NULL, DEFAULT '{}'             |
| section_order | TEXT[]       | NOT NULL                           |
| created_at    | TIMESTAMP    | DEFAULT NOW()                      |

---

## applications

| Column            | Type         | Constraints                                 |
| ----------------- | ------------ | ------------------------------------------- |
| id                | SERIAL       | PRIMARY KEY                                 |
| user_id           | INTEGER      | FK → users(id) ON DELETE CASCADE            |
| resume_version_id | INTEGER      | FK → resume_versions(id) ON DELETE SET NULL |
| company           | VARCHAR(255) | NOT NULL                                    |
| role              | VARCHAR(255) | NOT NULL                                    |
| job_url           | VARCHAR(500) |                                             |
| location          | VARCHAR(255) |                                             |
| salary            | VARCHAR(100) |                                             |
| status            | VARCHAR(50)  | NOT NULL, DEFAULT 'wishlist'                |
| notes             | TEXT         |                                             |
| applied_at        | TIMESTAMP    |                                             |
| is_deleted        | BOOLEAN      | DEFAULT false                               |
| created_at        | TIMESTAMP    | DEFAULT NOW()                               |
| updated_at        | TIMESTAMP    | DEFAULT NOW()                               |

> `status` allowed values: `wishlist`, `applied`, `interview`, `offer`, `rejected`, `withdrawn`

---

## interviews

| Column         | Type         | Constraints                             |
| -------------- | ------------ | --------------------------------------- |
| id             | SERIAL       | PRIMARY KEY                             |
| application_id | INTEGER      | FK → applications(id) ON DELETE CASCADE |
| user_id        | INTEGER      | FK → users(id) ON DELETE CASCADE        |
| interview_type | VARCHAR(50)  | NOT NULL, DEFAULT 'online'              |
| scheduled_at   | TIMESTAMP    | NOT NULL                                |
| location       | VARCHAR(500) |                                         |
| notes          | TEXT         |                                         |
| outcome        | VARCHAR(50)  |                                         |
| checked_in     | BOOLEAN      | DEFAULT false                           |
| reminder_sent  | BOOLEAN      | DEFAULT false                           |
| created_at     | TIMESTAMP    | DEFAULT NOW()                           |
| updated_at     | TIMESTAMP    | DEFAULT NOW()                           |

> `interview_type` allowed values: `online`, `on-site`, `phone`, `technical`, `hr`
> `outcome` allowed values: `offer`, `rejected`, `waiting`, `NULL`

---

## interview_prep_topics

| Column       | Type         | Constraints                           |
| ------------ | ------------ | ------------------------------------- |
| id           | SERIAL       | PRIMARY KEY                           |
| interview_id | INTEGER      | FK → interviews(id) ON DELETE CASCADE |
| user_id      | INTEGER      | FK → users(id) ON DELETE CASCADE      |
| topic        | VARCHAR(255) | NOT NULL                              |
| is_completed | BOOLEAN      | DEFAULT false                         |
| created_at   | TIMESTAMP    | DEFAULT NOW()                         |

---

## activities

| Column      | Type         | Constraints                      |
| ----------- | ------------ | -------------------------------- |
| id          | SERIAL       | PRIMARY KEY                      |
| user_id     | INTEGER      | FK → users(id) ON DELETE CASCADE |
| entity_type | VARCHAR(50)  | NOT NULL                         |
| entity_id   | INTEGER      | NOT NULL                         |
| action      | VARCHAR(100) | NOT NULL                         |
| metadata    | JSONB        | DEFAULT '{}'                     |
| created_at  | TIMESTAMP    | DEFAULT NOW()                    |

> `entity_type` allowed values: `resume`, `application`, `interview`, `version`

---

## email_logs

| Column        | Type         | Constraints                            |
| ------------- | ------------ | -------------------------------------- |
| id            | SERIAL       | PRIMARY KEY                            |
| user_id       | INTEGER      | FK → users(id) ON DELETE CASCADE       |
| interview_id  | INTEGER      | FK → interviews(id) ON DELETE SET NULL |
| email_type    | VARCHAR(50)  | NOT NULL                               |
| recipient     | VARCHAR(255) | NOT NULL                               |
| status        | VARCHAR(50)  | NOT NULL, DEFAULT 'sent'               |
| error_message | TEXT         |                                        |
| sent_at       | TIMESTAMP    | DEFAULT NOW()                          |

> `email_type` allowed values: `interview_reminder`, `checkin_followup`
> `status` allowed values: `sent`, `failed`
