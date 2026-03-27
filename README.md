# Enterprise Demo App

[![CI](https://github.com/AlexeyZip/angular-demo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexeyZip/angular-demo-app/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/AlexeyZip/angular-demo-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/AlexeyZip/angular-demo-app/actions/workflows/deploy.yml)

Demo enterprise-style Angular application with:

- Angular 19 (standalone, lazy routes, resolvers)
- RxJS + NgRx
- UI library (`projects/ui`) with reusable controls
- Node/Express backend for demo API and realtime streams
- CI/CD via GitHub Actions + GitHub Pages

## Live Demo

- [Open app](https://alexeyzip.github.io/angular-demo-app/)

## Local Run

Install dependencies:

```bash
npm ci
```

Run frontend + backend:

```bash
npm run start:full
```

## Scripts

- `npm run lint` - type-check for CI
- `npm run build` - production build
- `npm run test:unit` - jest unit tests
- `npm run test:unit:ci` - jest tests with coverage
- `npm run e2e` - Playwright e2e
- `npm run e2e:ci` - e2e in CI mode

## CI/CD

### CI (`.github/workflows/ci.yml`)

Runs on push to `main` and pull requests:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm run test:unit:ci` with coverage artifact upload
5. `npm run e2e:ci`
6. On e2e failure, uploads Playwright artifacts (`playwright-report`, `test-results`)

### CD (`.github/workflows/deploy.yml`)

Triggered after successful CI on `main`, builds app with proper `base-href` and deploys static output to GitHub Pages.
