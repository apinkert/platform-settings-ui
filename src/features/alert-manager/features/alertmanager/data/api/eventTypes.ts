import axios from 'axios';
import { EventTypesParams, EventTypesResponse } from '../../types';

const API_BASE = '/api/notifications/v1.0';

export const fetchEventTypes = async (
  params: EventTypesParams,
): Promise<EventTypesResponse> => {
  const queryParams = new URLSearchParams();

  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.eventTypeName) {
    queryParams.append('eventTypeName', params.eventTypeName);
  }
  if (params.applicationIds && params.applicationIds.length > 0) {
    params.applicationIds.forEach((id) => {
      queryParams.append('applicationIds', id);
    });
  }

  const response = await axios.get<EventTypesResponse>(
    `${API_BASE}/notifications/eventTypes?${queryParams.toString()}`,
  );
  return response.data;
};
