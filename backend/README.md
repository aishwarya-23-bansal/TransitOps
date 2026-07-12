# TransitOps Backend — Member 1 Part (Auth + Vehicle + Driver)

## Ye kya hai
Ye tumhara (Member 1) poora backend module hai:
- Database schema (7 models: User, Vehicle, Driver, Trip, Maintenance, FuelLog, Expense)
- Authentication (Register + Login with JWT)
- RBAC (Role-Based Access Control)
- Vehicle Registry API (full CRUD)
- Driver Management API (full CRUD)

## Setup karne ke steps

### 1. MongoDB chalao
Agar MongoDB local machine pe install nahi hai, to sabse aasan tareeka hai **MongoDB Atlas** (free cloud DB) use karna:
1. https://www.mongodb.com/cloud/atlas/register pe free account banao
2. Free cluster banao, "Connect" -> "Drivers" se connection string copy karo
3. Wo string `.env` file mein `MONGO_URI` mein daal do

Ya agar local MongoDB install hai to `MONGO_URI=mongodb://127.0.0.1:27017/transitops` hi rakho.

### 2. Dependencies install karo
```bash
cd backend
npm install
```

### 3. .env file banao
`.env.example` ko copy karke `.env` banao aur values apni daal do:
```bash
cp .env.example .env
```

### 4. Server chalao
```bash
npm run dev
```
Agar sab sahi hai to terminal mein dikhega:
```
MongoDB Connected: ...
Server running on port 5000
```

## APIs test karna (Postman ya curl se)

### 1. Register (naya user banao)
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Rahul Fleet",
  "email": "fleet@test.com",
  "password": "123456",
  "role": "FleetManager"
}
```
Response mein ek `token` milega — isko copy karke rakh lo, aage sab requests mein chahiye hoga.

Roles yehi 4 use kar sakte ho: `FleetManager`, `Driver`, `SafetyOfficer`, `FinancialAnalyst`

### 2. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "fleet@test.com",
  "password": "123456"
}
```

### 3. Vehicle banao (sirf FleetManager kar sakta hai)
```
POST http://localhost:5000/api/vehicles
Headers: Authorization: Bearer <token yaha paste karo>
Body (JSON):
{
  "registrationNumber": "UP20-VAN-05",
  "name": "Van-05",
  "type": "Van",
  "maxLoadCapacity": 500,
  "acquisitionCost": 800000,
  "region": "North"
}
```

### 4. Saare vehicles dekho
```
GET http://localhost:5000/api/vehicles
Headers: Authorization: Bearer <token>
```

### 5. Sirf "Available" vehicles dekho (ye endpoint Member 2 aur 3 use karenge trip banate waqt)
```
GET http://localhost:5000/api/vehicles/eligible
Headers: Authorization: Bearer <token>
```

### 6. Driver banao (FleetManager ya SafetyOfficer kar sakta hai)
```
POST http://localhost:5000/api/drivers
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "name": "Alex",
  "licenseNumber": "DL-12345",
  "licenseCategory": "LMV",
  "licenseExpiryDate": "2027-12-31",
  "contactNumber": "9876543210"
}
```

### 7. Eligible drivers dekho (jinka license expire nahi hua aur Available hain)
```
GET http://localhost:5000/api/drivers/eligible
Headers: Authorization: Bearer <token>
```

### 8. Trip banao (Draft status mein) — Driver ya FleetManager kar sakta hai
```
POST http://localhost:5000/api/trips
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "source": "Delhi",
  "destination": "Agra",
  "vehicle": "<vehicle ka _id yaha paste karo>",
  "driver": "<driver ka _id yaha paste karo>",
  "cargoWeight": 450,
  "plannedDistance": 220
}
```
Yeh automatically check karega: cargo weight <= vehicle capacity, vehicle Available hai, driver Available hai aur license expire nahi hua.

### 9. Trip dispatch karo (Draft -> Dispatched)
```
PUT http://localhost:5000/api/trips/<trip_id>/dispatch
Headers: Authorization: Bearer <token>
```
Isse vehicle aur driver dono automatically "On Trip" ho jayenge.

### 10. Trip complete karo (Dispatched -> Completed)
```
PUT http://localhost:5000/api/trips/<trip_id>/complete
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "finalOdometer": 45230,
  "fuelConsumed": 18
}
```
Isse vehicle aur driver dono wapas "Available" ho jayenge, vehicle ka odometer bhi update ho jayega.

### 11. Trip cancel karo
```
PUT http://localhost:5000/api/trips/<trip_id>/cancel
Headers: Authorization: Bearer <token>
```
Agar trip Dispatched thi to vehicle/driver wapas Available ho jayenge.

### 12. Maintenance record banao (sirf FleetManager) — vehicle automatically "In Shop" ho jayega
```
POST http://localhost:5000/api/maintenance
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "vehicle": "<vehicle ka _id>",
  "description": "Oil Change",
  "cost": 1500
}
```

### 13. Maintenance close karo — vehicle wapas "Available" ho jayega (agar Retired nahi hai)
```
PUT http://localhost:5000/api/maintenance/<maintenance_id>/close
Headers: Authorization: Bearer <token>
```

## Important — Team ke liye

- **Member 2 ko batana:** Trip banate waqt `/api/vehicles/eligible` aur `/api/drivers/eligible` endpoints use karna, poori list nahi — inme automatically Retired/In Shop/Suspended/expired-license wale hat jayenge.
- **Member 2 ko:** Trip/Maintenance ke Mongoose models (`models/Trip.js`, `models/Maintenance.js`) pehle se bana ke rakhe hain, seedha inhi ko use kar sakte ho, routes/controllers khud banane honge.
- **Member 4 ko:** FuelLog aur Expense models (`models/FuelLog.js`, `models/Expense.js`) bhi ready hain.
- **Member 3 (frontend) ko:** Login response mein `token` milta hai — usko localStorage/state mein store karo, har API call mein `Authorization: Bearer <token>` header bhejna zaroori hai.

## Folder Structure
```
backend/
├── config/db.js          # MongoDB connection
├── models/                # Saare database schemas
├── middleware/
│   ├── auth.js            # JWT verify (login check)
│   └── roleCheck.js       # RBAC (role check)
├── controllers/           # Business logic
├── routes/                # API endpoints
└── server.js              # Entry point
```
