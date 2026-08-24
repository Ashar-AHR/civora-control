# Civora Control

Neutral public codebase for a controlled commercial-management web application.

## Current gate

M01.1 Foundation test build only. The branch must use Firebase emulators and synthetic data. It is not authorized for production deployment, GitHub Pages, live user creation, or commercial data.

## Local verification

```bash
npm install
npm run check
npm run test:emulator
```

The application uses Email/Password authentication, exact P136 profile authorization, two roles (`commercial_manager` and `senior_qs`), session-only persistence, a 30-minute inactivity timeout, default-deny Firestore Rules, and no persistent offline Firestore cache.

## Data prohibition

Never commit real project/contractor identities, contract numbers, values, invoices, documents, exports, backups, passwords, tokens, private keys or service-account files. All test identities use the reserved `.invalid` domain and synthetic values.
