export type EventLogEntryActionStatus =
  | 'SENT'
  | 'SUCCESS'
  | 'PROCESSING'
  | 'FAILED'
  | 'UNKNOWN';

export type EndpointType =
  | 'ansible'
  | 'camel'
  | 'drawer'
  | 'email_subscription'
  | 'webhook'
  | 'pagerduty';

export type Severity =
  | 'CRITICAL'
  | 'IMPORTANT'
  | 'MODERATE'
  | 'LOW'
  | 'NONE'
  | 'UNDEFINED';

export interface EventLogEntryAction {
  id: string;
  endpoint_type: EndpointType;
  endpoint_sub_type?: string;
  status: EventLogEntryActionStatus;
  endpoint_id?: string;
  details?: Record<string, unknown>;
  recipients_count?: number;
}

export interface EventLogEntry {
  id: string;
  event_type: string;
  application: string;
  bundle: string;
  created: string;
  actions: EventLogEntryAction[];
  severity?: Severity;
  payload?: string;
}

export interface PageEventLogEntry {
  data: EventLogEntry[];
  links: Record<string, string>;
  meta: { count: number };
}

export interface EventLogParams {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  bundleIds?: string[];
  appIds?: string[];
  endpointTypes?: string[];
  eventTypeDisplayName?: string;
  invocationResults?: string[];
  status?: EventLogEntryActionStatus[];
  severities?: Severity[];
  sortBy?: string;
  includeActions?: boolean;
  includeDetails?: boolean;
  includePayload?: boolean;
}
