# Project Rules & Development Guidelines

These rules are mandatory constraints that must be followed for all future development, modifications, and deployment workflows across this codebase.

---

## 🔒 Rule 1: Database Preservation & Immutability
- **Do NOT modify, drop, flush, or overwrite the database** (MongoDB Atlas cluster or collections) unless the user gives **explicit, direct permission**.
- Do not run commands or seed scripts that drop existing databases (`dropDatabase()`, `deleteMany({})` on live clusters) without confirmation.
- Preserve the existing `MONGO_URI` connection strings, production records, collections, and indexes in `.env` and deployment environments.

---

## 🧪 Rule 2: Strict Pre-Push Error Verification & Build Checks
Before staging, committing, or pushing any code to the Git repository, perform a comprehensive error audit to avoid breaking live deployments on Vercel and Render:
1. **Frontend Build Check**:
   - Run `npm run build --prefix client` to ensure zero Vite compilation errors, TypeScript/JSX syntax issues, or broken imports.
2. **Backend Syntax & API Verification**:
   - Verify that all Express routes, controllers, middleware, and Zod schemas load with zero syntax or runtime import errors.
   - Run integration tests (`npm run test --prefix server` or test runner) when backend endpoints are modified.
3. **Configuration & URL Verification**:
   - Ensure CORS headers, API base URLs, and environment variables match active deployment targets (`https://neo-literacy.vercel.app` and `https://neo-literacy-assistance-platform.onrender.com`).
4. **Git Metadata & Author Check**:
   - Ensure the Git commit author uses a valid email address (`Jinkapadma@users.noreply.github.com`) so Vercel automated deployments are never blocked.

---

## 🚀 Rule 3: Conditional Git Updates on Task Completion
- Only push to the remote Git repository (`origin main`) **after** all verification checks in **Rule 2** pass with 100% satisfaction.
- If any build, lint, or runtime test fails:
  1. Fix the error immediately.
  2. Re-verify the build.
  3. Only once all tests and builds succeed, stage, commit, and push the changes.
- Provide clear, conventional commit messages (e.g. `feat:`, `fix:`, `chore:`, `docs:`) summarizing the exact changes made.

---

## 📋 Standard Verification Checklist
- [ ] Database preserved without unauthorized schema/data drops.
- [ ] `npm run build --prefix client` passed with 0 errors.
- [ ] Backend syntax and route integrity verified.
- [ ] Git commit author verified (`Jinkapadma <Jinkapadma@users.noreply.github.com>`).
- [ ] Pushed to GitHub `origin main` only upon full test satisfaction.
