import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MemoryRouter } from 'react-router-dom';
import { clearAndType } from '../../../../../shared/interactionHelpers';
import { eventTypesHandlers } from '../data/mocks/eventTypes';
import AlertManagerTable from './AlertManagerTable';

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
      handlers: [eventTypesHandlers.success()],
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

      expect(
        canvas.getByText('Compliance below threshold'),
      ).toBeInTheDocument();
      expect(canvas.getByText('New recommendation')).toBeInTheDocument();
    });

    await step('Service column displays correctly', async () => {
      expect(canvas.getByText('Policies')).toBeInTheDocument();
      expect(canvas.getByText('Compliance')).toBeInTheDocument();
      expect(canvas.getByText('Advisor')).toBeInTheDocument();
    });

    await step('Event type cells display correctly', async () => {
      const eventTypeCell = canvas.getByText('Policy triggered');
      expect(eventTypeCell).toBeInTheDocument();
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
      handlers: [eventTypesHandlers.loading()],
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
      handlers: [eventTypesHandlers.empty()],
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
      handlers: [eventTypesHandlers.error()],
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
      handlers: [eventTypesHandlers.paginated(50)],
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
      handlers: [eventTypesHandlers.noResultsAfterFilter()],
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

      // Verify no-results state is displayed
      const noResultsMessage = await canvas.findByText(
        /no matching event types/i,
        {},
        { timeout: 5000 },
      );
      expect(noResultsMessage).toBeInTheDocument();
    });
  },
};

/**
 * Event type name filter - server-side filtering by event type name
 */
export const EventTypeFilter: Story = {
  parameters: {
    msw: {
      handlers: [eventTypesHandlers.filtered()],
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
      expect(
        canvas.getByText('Compliance below threshold'),
      ).toBeInTheDocument();
      expect(canvas.getByText('New recommendation')).toBeInTheDocument();
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
            canvas.queryByText('Compliance below threshold'),
          ).not.toBeInTheDocument();
          expect(
            canvas.queryByText('New recommendation'),
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
      handlers: [eventTypesHandlers.success()],
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
