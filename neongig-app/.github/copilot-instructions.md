# Copilot Instructions for neongig-app

## Project Overview
- This is a React single-page application (SPA) for a freelance marketplace, with pages for home, user profile, freelancer profile, login, and more.
- All main user-facing logic is in `src/pages/`, with each page as a separate React component (e.g., `Home.js`, `UserProfile.js`, `FreelancerProfile.js`).
- Routing is handled via `react-router-dom`.
- User authentication state is managed using `localStorage` (key: `userData`).

## Key Patterns & Conventions
- **Authentication:**
  - Most pages check `localStorage.getItem('userData')` for login state and user type.
  - If not logged in, users are redirected to `/signin` or `/`.
  - Logging out clears `userData` from localStorage and may show a custom popup (see `Home.js`).
- **User Types:**
  - There are at least two user types: `buyer` and `seller`/`freelancer`.
  - Pages adapt UI and data based on `userType` (see `UserProfile.js`, `FreelancerProfile.js`).
- **Sample Data:**
  - Demo/sample data for services, orders, and reviews is hardcoded in components for now.
- **UI State:**
  - React `useState` and `useEffect` are used for all state and side effects.
  - No global state management (e.g., Redux) is used.

## Developer Workflows
- **No build/test scripts or package.json found.**
  - To run locally, ensure you have a React environment (e.g., create-react-app or Vite) and place these files in `src/pages/`.
  - Add routing in your main app entry point to use these pages.
- **Debugging:**
  - Use browser devtools and React DevTools for debugging state and props.
  - Check localStorage for `userData` to simulate login/logout.

## Integration Points
- **External dependencies:**
  - `react`, `react-router-dom` are required.
  - Some UI uses FontAwesome icons via `<i class="fas ...">` (ensure FontAwesome is loaded in your app).
- **No backend/API integration yet:**
  - All data is local and static; replace with API calls as needed.

## Project-Specific Advice
- When adding new pages, follow the pattern in `src/pages/`—export a default React function, use local state, and check login state via localStorage.
- For authentication, always update and check `userData` in localStorage for consistency.
- Use hardcoded sample data as a template for future API integration.

## Example: Checking Login State
```js
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('userData') || 'null');
  if (user && user.isLoggedIn) {
    setIsLoggedIn(true);
    setUserData(user);
  } else {
    setIsLoggedIn(false);
    setUserData(null);
    window.location.href = '/signin';
  }
}, []);
```

## Key Files
- `src/pages/Home.js` — Home page, login/logout logic, currency UI
- `src/pages/UserProfile.js` — User dashboard, tabs for orders/services/reviews
- `src/pages/FreelancerProfile.js` — Freelancer dashboard, stats, recent orders
- `src/pages/Login.js` — Login/registration form, validation

---

_If any conventions or workflows are unclear or missing, please provide feedback so this guide can be improved._
