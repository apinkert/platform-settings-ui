# Custom ESLint Rules

Local ESLint rules registered under the `platform-settings-local` plugin namespace.
These rules enforce patterns used in this application — they land in
the same PR as the pattern they govern.

## Rules

### `platform-settings-local/enforce-story-patterns`

**Severity:** error
**Applies to:** `src/**/*.stories.@(ts|tsx)`

Enforces correct query patterns in Storybook play functions:
- Disallows `canvasElement.querySelector()` / `querySelectorAll()` —
  use `within()` + role/text queries instead
- Disallows `getBy*` / `getAllBy*` inside `waitFor` callbacks —
  use `queryBy*` + `expect` inside `waitFor`, or `findBy*` outside

See: `src/shared/StorybookPatterns.mdx`

### `platform-settings-local/require-use-table-state`

**Severity:** error
**Applies to:** `src/**/*.ts`, `src/**/*.tsx`

Enforces that `TableView` from `@redhat-cloud-services/frontend-components`
is always paired with the `useTableState` hook. Direct construction of
table state objects bypasses pagination, sorting, and filter sync logic.

Disable with an inline comment when the hook is used in a wrapper:
```tsx
// eslint-disable-next-line platform-settings-local/require-use-table-state -- tableState provided by useRolesTable hook
```

See: `src/shared/TableView.mdx`

### `platform-settings-local/no-direct-user-type`

**Severity:** error
**Applies to:** `src/**/*.stories.@(ts|tsx)`

Enforces that Storybook stories use `userEvent.setup()` from
`storybook/test` instead of directly calling `userEvent.click()` etc.
Setup-based interaction ensures proper event sequencing and cleanup.

See: `src/shared/interactionHelpers.ts`
