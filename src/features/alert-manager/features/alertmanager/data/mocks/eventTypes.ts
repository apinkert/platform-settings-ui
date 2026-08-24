import { EventType, EventTypesResponse } from '../../types';

export const mockEventTypes: EventType[] = [
  {
    id: '1',
    name: 'policy-triggered',
    display_name: 'Policy triggered',
    application_id: 'app-policies',
    application: {
      id: 'app-policies',
      name: 'policies',
      display_name: 'Policies',
      bundle_id: 'bundle-1',
    },
    description: 'A configured policy has been triggered',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '2',
    name: 'new-recommendation',
    display_name: 'New recommendation',
    application_id: 'app-advisor',
    application: {
      id: 'app-advisor',
      name: 'advisor',
      display_name: 'Advisor',
      bundle_id: 'bundle-1',
    },
    description: 'New recommendation available for your systems',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '3',
    name: 'compliance-below-threshold',
    display_name: 'Compliance below threshold',
    application_id: 'app-compliance',
    application: {
      id: 'app-compliance',
      name: 'compliance',
      display_name: 'Compliance',
      bundle_id: 'bundle-1',
    },
    description: 'System compliance has fallen below configured threshold',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '4',
    name: 'new-cve',
    display_name: 'New CVE detected',
    application_id: 'app-vulnerability',
    application: {
      id: 'app-vulnerability',
      name: 'vulnerability',
      display_name: 'Vulnerability',
      bundle_id: 'bundle-1',
    },
    description: 'A new CVE has been detected affecting your systems',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '5',
    name: 'system-registered',
    display_name: 'System registered',
    application_id: 'app-inventory',
    application: {
      id: 'app-inventory',
      name: 'inventory',
      display_name: 'Inventory',
      bundle_id: 'bundle-1',
    },
    description: 'A new system has been registered',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '6',
    name: 'patch-available',
    display_name: 'Patch available',
    application_id: 'app-patch',
    application: {
      id: 'app-patch',
      name: 'patch',
      display_name: 'Patch',
      bundle_id: 'bundle-1',
    },
    description: 'New patches are available for your systems',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '7',
    name: 'drift-detected',
    display_name: 'Drift detected',
    application_id: 'app-drift',
    application: {
      id: 'app-drift',
      name: 'drift',
      display_name: 'Drift',
      bundle_id: 'bundle-1',
    },
    description: 'Configuration drift has been detected',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '8',
    name: 'image-build-failed',
    display_name: 'Image build failed',
    application_id: 'app-image-builder',
    application: {
      id: 'app-image-builder',
      name: 'image-builder',
      display_name: 'Image Builder',
      bundle_id: 'bundle-1',
    },
    description: 'An image build has failed',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '9',
    name: 'activation-key-created',
    display_name: 'Activation key created',
    application_id: 'app-subscription-services',
    application: {
      id: 'app-subscription-services',
      name: 'subscription-services',
      display_name: 'Subscriptions',
      bundle_id: 'bundle-1',
    },
    description: 'A new activation key has been created',
    visible: true,
    subscribed_by_default: false,
  },
  {
    id: '10',
    name: 'remediation-completed',
    display_name: 'Remediation completed',
    application_id: 'app-remediations',
    application: {
      id: 'app-remediations',
      name: 'remediations',
      display_name: 'Remediations',
      bundle_id: 'bundle-1',
    },
    description: 'A remediation playbook has completed execution',
    visible: true,
    subscribed_by_default: false,
  },
];

export const createMockEventTypesResponse = (
  limit = 20,
  offset = 0,
  total?: number,
): EventTypesResponse => {
  const allEvents = total ? mockEventTypes.slice(0, total) : mockEventTypes;
  const paginatedEvents = allEvents.slice(offset, offset + limit);

  return {
    data: paginatedEvents,
    meta: {
      count: allEvents.length,
    },
  };
};
