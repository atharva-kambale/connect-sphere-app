# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Connect Sphere, please report it responsibly.

**⚠️ Do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send a detailed report to the project maintainer
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Fix & Disclosure**: Coordinated with the reporter

## Security Measures

This project implements the following security measures:

- **Helmet.js** — Sets secure HTTP headers (HSTS, X-Content-Type-Options, etc.)
- **Rate Limiting** — Prevents brute-force attacks on authentication endpoints
- **MongoDB Sanitization** — Protects against NoSQL injection attacks
- **HPP** — Prevents HTTP parameter pollution
- **Input Validation** — Validates and sanitizes all user inputs
- **bcrypt Password Hashing** — Passwords are never stored in plain text
- **JWT Authentication** — Stateless, token-based authentication with expiry
- **CORS Restriction** — API only accepts requests from allowed origins
- **Socket.io Authentication** — WebSocket connections require valid JWT
- **Environment Variables** — All secrets stored in `.env` (never committed)

## Best Practices for Contributors

- Never commit `.env` files or hardcoded secrets
- Always validate and sanitize user input
- Use parameterized queries (Mongoose handles this)
- Keep dependencies updated (`npm audit`)
- Follow the principle of least privilege
