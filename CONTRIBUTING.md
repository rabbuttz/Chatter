# Contributing

## Branch Rules

- `main` is integration-only
- Never push feature work directly to `main`
- Use one branch per worker scope

Branch naming:
- `w01-schema/<topic>`
- `w02-auth/<topic>`
- `w03-ui/<topic>`
- `w04-setup/<topic>`
- `w05-intake/<topic>`
- `w06-knowledge/<topic>`
- `w07-engine/<topic>`
- `w08-public/<topic>`
- `w09-inbox/<topic>`
- `w10-dashboard/<topic>`

## Ownership

- `packages/domain`: Worker 01
- `packages/ui`: Worker 03
- `packages/inquiry-engine`: Worker 07
- `packages/db`: Worker 01 or Worker 09/10 under lead review
- `apps/web/src/app/(admin)/setup`: Worker 04
- `apps/web/src/app/(admin)/settings/intake`: Worker 05
- `apps/web/src/app/(admin)/settings/knowledge`: Worker 06
- `apps/web/src/app/c/[slug]`: Worker 08
- `apps/web/src/app/(admin)/inbox`: Worker 09
- `apps/web/src/app/(admin)/dashboard`: Worker 10

If a change crosses ownership, split it or get lead review before merge.

## Pull Requests

- Keep PRs small and single-purpose
- Do not mix contract changes with unrelated UI work
- If you change `packages/domain` or `packages/ui`, call that out explicitly in the PR
- Add exact verification commands and results to the PR description

Required local checks:
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Manual GitHub Settings

This repository should enable the following branch protection rules on `main`:

- Require a pull request before merging
- Require approvals before merging
- Dismiss stale approvals when new commits are pushed
- Require status checks to pass before merging

Required status checks:
- `validate`

Additional recommended settings:
- Block force pushes
- Block deletions
- Require branches to be up to date before merging

## CI

GitHub Actions runs `.github/workflows/ci.yml` on pushes to `main` and pull requests targeting `main`.

The workflow must stay green for merge:
- lint
- typecheck
- build
