# TransitOps Member 4 - Data & Analytics Module

This standalone module contains only Member 4's Fuel, Expense, Analytics, CSV export, and PDF export work. It intentionally does not include authentication or Vehicle, Driver, Trip, or Maintenance CRUD.

## Use

```bash
npm install
copy .env.example .env
npm run dev
```

Copy the `src/` directory and `server.js` into the shared backend when integrating. Full endpoint documentation is in `src`'s source project README; routes are mounted at `/api/fuel`, `/api/expenses`, `/api/analytics`, and `/api/export`.
