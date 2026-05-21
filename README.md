# Sentry (Flows App)

A Flows app that integrates with [Sentry](https://sentry.io). Lets flows react
to Sentry webhooks (issue lifecycle events, alert triggers) and call the Sentry
REST API.

## App Configuration

**Required:**

- **Sentry URL** -- your Sentry instance URL (e.g. `https://my-org.sentry.io`).
- **Auth Token** -- token from a Sentry Internal Integration.
- **Webhook Client Secret** -- client secret from the same Internal
  Integration, used to verify inbound webhook signatures.

Setup requires creating an Internal Integration in Sentry -- the installation
instructions in the app walk through this step by step.

## Blocks

### Request

- **Run API Request** -- authenticated method/path/body/query request against
  the Sentry API (escape hatch).

### Events

- **Any Event** -- receives any webhook event from Sentry, with optional
  resource/action filters (escape hatch).

<!-- TODO: uncomment when typed webhook blocks are implemented
- **Issue Created** -- triggers when a Sentry issue is first created.
- **Issue Resolved** -- triggers when a Sentry issue is resolved.
- **Issue Unresolved** -- triggers when a Sentry issue is unresolved.
- **Alert Triggered** -- triggers when a Sentry alert rule fires.
-->

<!-- TODO: uncomment when issue blocks are implemented
### Issues

- **Get Issue** -- retrieves a Sentry issue by ID.
- **Update Issue** -- updates a Sentry issue (resolve, ignore, assign, etc.).
-->

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
```

### Available Scripts

```bash
npm run typecheck    # Type checking
npm run format       # Code formatting
npm run bundle       # Create deployment bundle
```

## Releasing

Follow [Semantic Versioning](https://semver.org/). Tag-based releases:

```bash
git tag v1.0.0
git push origin v1.0.0
```

CI automatically creates the release and updates the version registry.
