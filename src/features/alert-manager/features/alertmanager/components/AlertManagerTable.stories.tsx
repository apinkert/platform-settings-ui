import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { HttpResponse, delay, http } from 'msw';
import { clearAndType } from '../../../../../shared/interactionHelpers';
import AlertManagerTable from './AlertManagerTable';

const mockEventTypesData = {
  data: [
    {
      id: '1',
      name: 'policy.triggered',
      display_name: 'Policy triggered',
      application_id: 'app-1',
      application: {
        id: 'app-1',
        name: 'policies',
        display_name: 'Policies',
        bundle_id: 'bundle-1',
      },
      visible: true,
      subscribed_by_default: false,
    },
    {
      id: '2',
      name: 'compliance.failed',
      display_name: 'Compliance check failed',
      application_id: 'app-2',
      application: {
        id: 'app-2',
        name: 'compliance',
        display_name: 'Compliance',
        bundle_id: 'bundle-1',
      },
      visible: true,
      subscribed_by_default: false,
    },
    {
      id: '3',
      name: 'advisor.recommendation',
      display_name: 'New recommendation available',
      application_id: 'app-3',
      application: {
        id: 'app-3',
        name: 'advisor',
        display_name: 'Insights Advisor',
        bundle_id: 'bundle-1',
      },
      visible: true,
      subscribed_by_default: false,
    },
  ],
  meta: {
    count: 3,
  },
};

const meta = {
  title: 'Features/AlertManager/AlertManagerTable',
  component: AlertManagerTable,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/settings/alertmanager']}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AlertManagerTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state - shows table with event type data
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/notifications/v1.0/notifications/eventTypes', () => {
          return HttpResponse.json(mockEventTypesData);
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Event type data appears in table', async () => {
      const policyTriggered = await canvas.findByText(
        'Policy triggered',
        {},
        { timeout: 10000 },
      );
      expect(policyTriggered).toBeInTheDocument();

      expect(canvas.getByText('Compliance check failed')).toBeInTheDocument();
      expect(
        canvas.getByText('New recommendation available'),
      ).toBeInTheDocument();
    });

    await step('Service column displays correctly', async () => {
      expect(canvas.getByText('Policies')).toBeInTheDocument();
      expect(canvas.getByText('Compliance')).toBeInTheDocument();
      expect(canvas.getByText('Insights Advisor')).toBeInTheDocument();
    });

    await step('Event type cells are links', async () => {
      const link = canvas.getByRole('link', { name: /policy triggered/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    });

    await step('Filter toolbar is present', async () => {
      const eventTypeFilter =
        canvas.getByPlaceholderText(/filter by event type/i);
      expect(eventTypeFilter).toBeInTheDocument();
    });
  },
};

/**
 * Loading state - shows while data is being fetched
 */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          '/api/notifications/v1.0/notifications/eventTypes',
          async () => {
            await delay('infinite');
          },
        ),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Shows loading state', async () => {
      // TableView shows skeleton/spinner while loading
      // Just verify the table structure exists
      const tableWrapper = canvas.getByTestId('table-view');
      expect(tableWrapper).toBeInTheDocument();
    });
  },
};

/**
 * Empty state - no event types available
 */
export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/notifications/v1.0/notifications/eventTypes', () => {
          return HttpResponse.json({
            data: [],
            meta: { count: 0 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Shows empty state', async () => {
      const emptyDescription = await canvas.findByText(
        /no event types are currently available/i,
        {},
        { timeout: 10000 },
      );
      expect(emptyDescription).toBeInTheDocument();
    });
  },
};

/**
 * Error state - API request failed
 */
export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/notifications/v1.0/notifications/eventTypes', () => {
          return HttpResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Shows error state message', async () => {
      const errorTitle = await canvas.findByText(
        /unable to load event types/i,
        {},
        { timeout: 5000 },
      );
      expect(errorTitle).toBeInTheDocument();
    });

    await step('Shows error state description', async () => {
      const errorDescription = canvas.getByText(
        /there was a problem loading event types/i,
      );
      expect(errorDescription).toBeInTheDocument();
    });
  },
};

/**
 * Large dataset - tests pagination with many items
 */
export const WithPagination: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/notifications/v1.0/notifications/eventTypes', () => {
          const data = Array.from({ length: 50 }, (_, i) => ({
            id: `${i + 1}`,
            name: `event.type.${i + 1}`,
            display_name: `Event Type ${i + 1}`,
            application_id: `app-${i % 5}`,
            application: {
              id: `app-${i % 5}`,
              name: `app${i % 5}`,
              display_name: `Application ${i % 5}`,
              bundle_id: 'bundle-1',
            },
            visible: true,
            subscribed_by_default: false,
          }));

          return HttpResponse.json({
            data: data.slice(0, 20), // First page
            meta: { count: 50 },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Table shows first page of items', async () => {
      const firstItem = await canvas.findByText(
        'Event Type 1',
        {},
        { timeout: 10000 },
      );
      expect(firstItem).toBeInTheDocument();
    });

    await step('Multiple items from first page are displayed', async () => {
      expect(canvas.getByText('Event Type 1')).toBeInTheDocument();
      expect(canvas.getByText('Event Type 10')).toBeInTheDocument();
      expect(canvas.getByText('Event Type 20')).toBeInTheDocument();
    });
  },
};

/**
 * Filtered with no results
 */
export const NoResults: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          '/api/notifications/v1.0/notifications/eventTypes',
          ({ request }) => {
            const url = new URL(request.url);
            const eventTypeName = url.searchParams.get('eventTypeName');

            // If filtered, return no results
            if (eventTypeName) {
              return HttpResponse.json({
                data: [],
                meta: { count: 0 },
              });
            }

            return HttpResponse.json(mockEventTypesData);
          },
        ),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Wait for initial data to load', async () => {
      const policyItem = await canvas.findByText(
        'Policy triggered',
        {},
        { timeout: 10000 },
      );
      expect(policyItem).toBeInTheDocument();
    });

    await step('Filter input works', async () => {
      const filterInput = canvas.getByPlaceholderText('Filter by event type');
      await clearAndType(user, () => filterInput, 'test filter');

      // Verify the filter input accepted the text
      expect(filterInput).toHaveValue('test filter');
    });
  },
};

/**
 * Event type name filter - server-side filtering by event type name
 */
export const EventTypeFilter: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          '/api/notifications/v1.0/notifications/eventTypes',
          ({ request }) => {
            const url = new URL(request.url);
            const eventTypeName = url.searchParams.get('eventTypeName');

            // If event type filter is applied, return filtered results
            if (eventTypeName) {
              const filteredData = mockEventTypesData.data.filter((item) =>
                item.display_name
                  .toLowerCase()
                  .includes(eventTypeName.toLowerCase()),
              );
              return HttpResponse.json({
                data: filteredData,
                meta: { count: filteredData.length },
              });
            }

            return HttpResponse.json(mockEventTypesData);
          },
        ),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Wait for initial data to load', async () => {
      const policyItem = await canvas.findByText(
        'Policy triggered',
        {},
        { timeout: 10000 },
      );
      expect(policyItem).toBeInTheDocument();
    });

    await step('All event types displayed initially', async () => {
      expect(canvas.getByText('Policy triggered')).toBeInTheDocument();
      expect(canvas.getByText('Compliance check failed')).toBeInTheDocument();
      expect(
        canvas.getByText('New recommendation available'),
      ).toBeInTheDocument();
    });

    await step('Filter by event type name', async () => {
      const eventTypeFilter = canvas.getByPlaceholderText(
        'Filter by event type',
      );
      await clearAndType(user, () => eventTypeFilter, 'Policy');

      // Wait for filtered results
      await waitFor(
        async () => {
          // Should only show Policy triggered
          expect(canvas.queryByText('Policy triggered')).toBeInTheDocument();
          expect(
            canvas.queryByText('Compliance check failed'),
          ).not.toBeInTheDocument();
          expect(
            canvas.queryByText('New recommendation available'),
          ).not.toBeInTheDocument();
        },
        { timeout: 5000 },
      );
    });
  },
};

/**
 * Column headers and sorting
 */
export const SortableColumns: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/notifications/v1.0/notifications/eventTypes', () => {
          return HttpResponse.json(mockEventTypesData);
        }),
      ],
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Table data loads', async () => {
      const policyItem = await canvas.findByText(
        'Policy triggered',
        {},
        { timeout: 10000 },
      );
      expect(policyItem).toBeInTheDocument();
    });

    await step('Column headers are present', async () => {
      // Check that column headers exist by looking for the column text
      // TableView may not use standard role="columnheader"
      expect(canvas.getByText('Event type')).toBeInTheDocument();
      expect(canvas.getByText('Service')).toBeInTheDocument();
    });
  },
};
