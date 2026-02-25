# AI Mock Interview Preparation Platform

An AI-powered full-stack platform that simulates real technical interviews and delivers structured performance feedback using LLM evaluation.

This system enables candidates to practice realistic interview scenarios with video or text responses and receive AI-generated insights to improve performance.

---

## Features

- Role-based interview question generation  
- Video & text answer support  
- AI evaluation with structured scoring  
- Skill breakdown & performance analytics  
- Question-wise feedback for improvement  
- Secure authentication with Firebase  
- Interview history & progress tracking  
- Cloud video storage & processing  

---

## How the System Works

### 1️⃣ Start Interview
- User selects role, experience level, and topics.
- Backend calls Gemini AI to generate interview questions.
- Questions are stored and linked to a session.

### 2️⃣ Answer Questions
- User responds via:
  - Video (uploaded to Cloudinary)
  - Text input
- Responses are stored per question.

### 3️⃣ Finish Interview
- Backend collects all Q&A pairs.
- Gemini AI evaluates the interview.
- AI generates:
  - Overall score
  - Skill breakdown
  - Summary feedback
  - Improvement areas
  - Question-wise feedback

### 4️⃣ Review Performance
- Dashboard displays:
  - Performance metrics
  - Strengths & weaknesses
  - Question-level insights
  - Progress tracking

---

## 🏗️ Architecture Overview
React Frontend
↓
REST API (Node.js + Express)
↓
Service Layer (Gemini AI Processing)
↓
Prisma ORM
↓
PostgreSQL Database
↓
Cloudinary (Video Storage)


---

## 🗂️ Project Structure
frontend/
├── components/
├── pages/
├── services/
└── context/

backend/
├── routes/
├── controllers/
├── services/
├── middleware/
├── prisma/
└── config/


---

## Database Design

The system uses a **session-centric relational model**:

- **User** → platform users  
- **InterviewSession** → interview attempt  
- **Question** → generated interview questions  
- **SessionQuestion** → question order mapping  
- **Response** → candidate answers  
- **Evaluation** → AI-generated performance feedback  

Structured AI outputs are stored using JSON for flexibility.

---

## API Overview

### Interview
- `POST /interview/start` → create session & generate questions  
- `POST /interview/finish` → evaluate interview  

### Responses
- `POST /response/video` → submit video answer  
- `POST /response/text` → submit text answer  

### Review & Analytics
- `GET /interview/:sessionId/review` → get evaluation report  
- `GET /analytics/dashboard` → performance summary  

---

## AI Evaluation Pipeline

The evaluation engine uses Gemini AI to transform interview transcripts into structured insights.

### Generates:
- Overall performance score
- Communication & technical skill metrics
- Summary feedback
- Improvement suggestions
- Question-wise coaching feedback

This structured evaluation enables analytics and performance tracking.

---

## Tech Stack

### Frontend
- React + Vite  
- Tailwind CSS  
- Recharts  
- Firebase Authentication  

### Backend
- Node.js & Express  
- Prisma ORM  
- PostgreSQL  
- Gemini AI API  

### Media & Processing
- Cloudinary (video upload)  
- MediaRecorder API  
