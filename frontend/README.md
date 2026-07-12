# TransitOps — Frontend

Fleet management dashboard. React + Vite + Tailwind CSS.

## Setup

```bash
npm install
npm run dev
```

## Notes

- All data in `src/data/dummyData.js` — swap for API calls in `src/services/api.js`.
- Auth is dummy (any email/password, role picker). Replace `AuthContext.login` with a real API call and store the returned token.
- Set `VITE_API_URL` in `.env` to point at your backend.
- Login route: `/login`. All other routes are protected and redirect to login if no session exists.
