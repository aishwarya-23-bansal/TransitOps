# TransitOps Backend

## What this is
Backend for TransitOps — a smart transport operations platform (vehicles, drivers, trips, maintenance, fuel/expenses).

## Currently implemented
- Database schema (Mongoose models)
- Authentication (Register + Login with JWT)
- Auth middleware + RBAC setup

## Setup Instructions

### 1. Start MongoDB
If using local MongoDB, set this in `.env`:

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Create a .env file
Copy `.env.example` to `.env` and fill in your own values:
```bash
cp .env.example .env
```

### 4. Run the server
```bash
npm run dev
```
If everything is set up correctly, you should see:

MongoDB Connected: ...
Server running on port 5000

## Testing the APIs (Postman or Thunder Client)

### 1. Register (create a new user)
POST http://localhost:5000/api/auth/register
Body (JSON):
{
"name": "Rahul Fleet",
"email": "fleet@test.com",
"password": "123456",
"role": "FleetManager"
}
The response includes a `token` — copy it, you'll need it for all further requests.

Allowed roles: `FleetManager`, `Driver`, `SafetyOfficer`, `FinancialAnalyst`

### 2. Login
POST http://localhost:5000/api/auth/login
Body (JSON):
{
"email": "fleet@test.com",
"password": "123456"
}

### 3. Get your profile (tests a protected route)
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer <token>

## Folder Structure
backend/
├── config/db.js          # MongoDB connection  
├── models/                 # All database schemas  
├── middleware/  
│   ├── auth.js              # JWT verification (login check)  
│   └── roleCheck.js         # RBAC (role-based access check)  
├── controllers/            # Business logic  
├── routes/                  # API endpoints  
└── server.js                # Entry point  

## Notes for the team
- Vehicle/Driver/Trip/Maintenance modules will be added separately as they're completed.
- Every API call requires an `Authorization: Bearer <token>` header (except register/login).
