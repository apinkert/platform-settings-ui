import { notificationResourceV1GetBundleFacets } from '@redhat-cloud-services/notifications-client';
import { APIFactory } from '@redhat-cloud-services/javascript-clients-shared/utils';
import type { AxiosInstance } from 'axios';

const NOTIFICATIONS_API_BASE = '/api/notifications/v2';

const endpoints = { notificationResourceV1GetBundleFacets };

export function createBundlesApi(axios: AxiosInstance) {
  return APIFactory(NOTIFICATIONS_API_BASE, endpoints, { axios });
}
