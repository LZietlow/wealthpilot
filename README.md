# WealthPilot

Eine Personal Finance & Investment Intelligence Platform. Hier baue ich Schritt für Schritt eine vollständige Fintech-App mit Fullstack-Grundlage, ML-gestützter Kategorisierung, Security-Hardening und einer mobilen Companion-App.


## Features (aktueller Stand – Phase 1)

- User-Registrierung & Login mit JWT-basierter Authentifizierung
- Passwort-Hashing mit bcrypt
- Middleware-geschützte API-Routen
- Accounts-Übersicht (Backend + React-Dashboard)
- Lokale PostgreSQL-Datenbank via Docker

> Geplant für kommende Phasen: Transaction-CRUD, ML-Kategorisierung & Ausgaben-Prognose, Mobile Companion App, Anomalie-Detection.

## Tech-Stack

**Backend:** Node.js, Express, TypeScript, PostgreSQL
**Frontend:** React, TypeScript, Vite
**Infrastruktur:** Docker, Docker Compose

## Architektur
[React Frontend] 
      │ HTTP/JSON (REST)
      ▼
[Express API Layer] ── Middleware: Auth-Check (JWT), Fehlerbehandlung
      │
      ▼
[PostgreSQL] ── Users, Accounts, Transactions, Categories


## Lokales Setup

### Voraussetzungen
- Node.js (v18+)
- Docker Desktop

### 1. Repository klonen
```bash
git clone https://github.com/LZietlow/wealthpilot.git
cd wealthpilot
```

### 2. Datenbank starten
```bash
docker compose up -d
```

### 3. Backend einrichten
```bash
cd backend
npm install
cp .env.example .env
# .env mit deinen eigenen Werten befüllen (siehe docker-compose.yml für DB-Credentials)
npm run dev
```
Backend läuft auf `http://localhost:3000`.

### 4. Schema in die Datenbank einspielen
```bash
docker exec -i wealthpilot-db psql -U wealthpilot -d wealthpilot < backend/src/config/schema.sql
```

### 5. Frontend einrichten
```bash
cd frontend
npm install
npm run dev
```
Frontend läuft auf `http://localhost:5173`.

## API-Endpunkte (aktueller Stand)

| Methode | Endpunkt | Beschreibung | Auth erforderlich |
|---|---|---|---|
| POST | `/auth/register` | Neuen User registrieren | Nein |
| POST | `/auth/login` | Login, gibt JWT zurück | Nein |
| GET | `/accounts` | Accounts des eingeloggten Users | Ja (Bearer Token) |


## Roadmap

- [x] Phase 1: Fullstack-Grundlage (Auth, Accounts)
- [ ] Phase 2: ML-Kategorisierung & Ausgaben-Prognose
- [ ] Phase 3: Mobile Companion App
- [ ] Phase 4: Security-Hardening & Anomalie-Detection