# Contributing to Connect Sphere

Thank you for considering contributing to Connect Sphere! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies** for both frontend and backend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
5. **Copy the env template** and fill in your keys:
   ```bash
   cp backend/.env.example backend/.env
   ```

## Development Workflow

- Run the backend: `cd backend && npm run dev`
- Run the frontend: `cd frontend && npm run dev`
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`

## Commit Convention

Use clear, descriptive commit messages:

```
feat: add user avatar upload
fix: resolve chat message ordering bug
docs: update API documentation
refactor: extract email service utility
```

**Prefixes**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Pull Request Guidelines

1. **One PR per feature/fix** — keep changes focused
2. **Describe your changes** clearly in the PR description
3. **Test your changes** before submitting
4. **Update documentation** if your change affects the API or setup steps
5. **No secrets** — never commit `.env` files or API keys

## Code Style

- Use `const` / `let` (never `var`)
- Use async/await for asynchronous operations
- Follow existing file and folder naming conventions
- Add error handling for all async operations

## Reporting Issues

- Use GitHub Issues to report bugs
- Include steps to reproduce, expected vs. actual behavior
- Add relevant screenshots or error logs

## Security Vulnerabilities

Please refer to [SECURITY.md](./SECURITY.md) for reporting security issues. **Do not open a public issue for vulnerabilities.**
