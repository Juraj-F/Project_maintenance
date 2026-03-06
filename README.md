# Assembly Line Maintenance --- Fullstack Demo

Interactive maintenance dashboard with **3D station visualization**,  
**role-based access**, and **offline-capable workflows**.

This project demonstrates a full-stack architecture built with  
**React**, **React Three Fiber**, **Express**, and **PostgreSQL**.

The system supports resilient operation through:

- automatic **fallback to a seeded PostgreSQL database** for authentication
- **IndexedDB (Dexie) draft storage** when the API or live database is unavailable

This allows the application to remain usable even when external
infrastructure is temporarily offline.

------------------------------------------------------------------------

# Screenshots

## Station Overview
![Station Overview](docs/overview.png)

## Highlighting subassembly activates partform report
![Highlighting subassembly](docs/highlighting.png)

## Issue Reporting Form
![Issue Form](docs/partform.png)

## Partform saved
![Issue Form](docs/saved_form.png)

## Partform submitted
![Issue Form](docs/form_submit.png)


------------------------------------------------------------------------

# Small system architecture

```
Frontend (React + Three.js)
        |
        v
   Express API
        |
   PostgreSQL
   /        \
Live DB    Offline Seeded DB
        |
     Dexie

```
------------------------------------------------------------------------     

# Features

- Authentication (register/login)
- Persistent login state using Zustand + localStorage
- Role-based station access
- Interactive 3D station viewer (React Three Fiber)
- Issue reporting workflow
- Draft persistence via IndexedDB (Dexie)
- Docker seeded database for offline auth fallback
- Express API with PostgreSQL
- Vite + Tailwind frontend

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React
-   Vite
-   TailwindCSS
-   React Router
-   React Three Fiber / Drei / Postprocessing
-   Dexie (IndexedDB)

## Backend

-   Node.js
-   Express
-   PostgreSQL (`pg` Pool)
-   bcrypt password hashing

## Persistence

-   PostgreSQL (Live database)
-   Docker Seeded PostgreSQL (Offline fallback)
-   IndexedDB drafts (Dexie)

------------------------------------------------------------------------

# Architecture Overview

The backend supports **two database modes**:

### Live Database

Local PostgreSQL running on port `5432`.

### Offline Seeded Database (Docker)

Used when live DB is not available.

Server startup logic:

Try LIVE DB connection -> If failed -> switch to OFFLINE seeded DB

This ensures you can run this project without any setup.

------------------------------------------------------------------------

# Getting Started

## Install dependencies

Frontend
```bash
npm install

```

Backend
```bash
cd server npm install

```
------------------------------------------------------------------------

## Run Offline Database (Docker)

```bash
docker-compose up -d

```

Database runs on:

localhost:5433

------------------------------------------------------------------------

## Start Backend API

```bash
cd server npm start

```

API:

http://localhost:3001

------------------------------------------------------------------------

## Start Frontend

```bash
npm run dev

```
App:

http://localhost:5173

------------------------------------------------------------------------

# Demo Accounts

| id |      email      | password | access |
| -  | -               | -        | -      |
| 1  | user1@demo.com  |   1234   | ST-10  |
| 2  | user2@demo.com  |   1234   | ST-20  |
| 3  | admin@demo.com  |   1234   |  all   |


------------------------------------------------------------------------

# Authentication Flow

1. User logs in via React form
2. Express verifies password using bcrypt
3. Server returns user profile and allowed station access
4. Zustand store persists login state
5. localStorage restores session after refresh

------------------------------------------------------------------------

# Role-Based Access

Access is controlled by database table:

station_access

Login endpoint loads allowed stations and returns them to frontend.

UI decides:

-   show/hide station button
-   enable/disable navigation

------------------------------------------------------------------------

# Draft Workflow (IndexedDB)

Issue drafts are stored locally using Dexie:

-   Works offline
-   Persists between sessions
-   Can export drafts via API endpoint

IndexedDB data is visible in:

Chrome DevTools -> Application -> IndexedDB

------------------------------------------------------------------------

# Notes

-   This is a demo portfolio project --- JWT/session auth not
    implemented yet.
-   Offline Docker DB exists so you can run project without
    setup.
-   Some performance improvements (3D hover highlight) in progress

------------------------------------------------------------------------

# Author
## Juraj F
Junior Fullstack Portfolio Project --- Assembly Line Maintenance System

------------------------------------------------------------------------

# Optional Improvements (Planned)

-   JWT authentication
-   3D performance optimization
-   Issue dashboard
-   Drafts synchronization between offline and online databases when
    online database is available
