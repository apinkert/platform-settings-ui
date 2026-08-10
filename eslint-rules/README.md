# Custom ESLint Rules

This project's ESLint rules are provided by the
[experience-ui-governance](https://github.com/RedHatInsights/experience-ui-governance)
package under the `experience-ui` plugin namespace.

See `eslint.config.js` for config details and
`node_modules/experience-ui-governance/eslint-plugin/` for rule source.

## Active Rules

| Rule | Applies to | Purpose |
|------|-----------|---------|
| `experience-ui/require-use-table-state` | `src/**` | TableView must be paired with useTableState |
| `experience-ui/enforce-story-patterns` | `*.stories.tsx` | Bans querySelector and getBy* inside waitFor in play functions |
| `experience-ui/no-direct-user-type` | `*.stories.tsx` | Enforces clearAndType helper over user.type() |
| `experience-ui/no-boundary-violations` | `src/**` | Enforces feature island isolation — no cross-feature imports |
| `experience-ui/no-jest-snapshot` | `src/**` | Bans toMatchSnapshot and toMatchInlineSnapshot |

## Configs

| Config | Applies to | What it adds |
|--------|-----------|-------------|
| `recommended` | `src/**` | Core rules + restricted imports (useChrome, PF globals, react-router-dom) |
| `stories` | `*.stories.tsx` | Story-specific rules + MSW handler restrictions |
| `data-layer` | `data/queries/**` | DI contract enforcement for data layer hooks |
