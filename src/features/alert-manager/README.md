# Alert Manager

Manages notification event log, behavior groups, and alert configuration for the platform settings area.

## Structure

```
alert-manager/
├── data/
│   ├── api/
│   │   └── events.ts              # APIFactory wrapper for notifications client
│   ├── queries/
│   │   └── events.ts              # useEvents() + useEvent() hooks, query key factory
│   ├── mocks/
│   │   ├── seed.ts                # Seed data for MSW handlers and story assertions
│   │   └── events.ts              # MSW v2 handler factories
│   └── types/
│       └── events.types.ts        # Strongly-typed event log interfaces
├── features/
│   └── event-log/
│       ├── EventLogPage.tsx           # Page shell (PageHeader, banner, toolbar extras)
│       ├── EventLogPage.stories.tsx   # Storybook stories with play functions
│       └── components/
│           └── EventLogTable.tsx      # useTableState + TableView + filters
```

### API Client

Uses `@redhat-cloud-services/notifications-client` via `APIFactory`. The authenticated axios instance is injected through `ServiceContext`.

### Query Hooks

- `useEvents(params?)` — paginated event log list with filter support and `keepPreviousData` for smooth pagination.
- `useEvent(id)` — single event detail lookup.

### Query Keys

```ts
eventsKeys.all          // ['events']
eventsKeys.lists()      // ['events', 'list']
eventsKeys.list(p)      // ['events', 'list', params]
eventsKeys.details()    // ['events', 'detail']
eventsKeys.detail(id)   // ['events', 'detail', id]
```

### MSW Mocks

`createEventsHandlers(baseUrl?)` returns MSW v2 handlers backed by `eventsDb` (a resettable collection). Supports sorting, filtering by event name, endpoint types, action status, severity, and offset pagination. Stories reference `seedEvents` from `mocks/seed.ts` for assertions.

### Event Log Page

The Event Log page (`features/event-log/EventLogPage.tsx`) displays a paginated table of notification events with:

- **PageHeader** with bell icon, title, subtitle, and "Learn more" link
- **Admin/non-admin behavior** — non-admins see an info banner and a disabled "Only show events impacting me" checkbox
- **Filters** — Event name (text), Action Type, Action Status, Severity (checkboxes)
- **Date range** — Preset selector (Today, Yesterday, Last 7/14 days)
- **Severity column** — Colored labels with PatternFly severity icons
- **Notifiers column** — Grouped action badges by endpoint type
- **Row actions** — Kebab menu with "Manage my own alert preferences" and admin-only "Manage organization default settings"
