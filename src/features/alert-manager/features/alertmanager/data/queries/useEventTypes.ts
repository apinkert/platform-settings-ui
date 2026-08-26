import { useQuery } from '@tanstack/react-query';
import { EventTypesParams } from '../../types';
import { fetchEventTypes } from '../api/eventTypes';

export const eventTypesQueryKey = (params: EventTypesParams) => [
  'alertManager',
  'eventTypes',
  params,
];

export const useEventTypes = (params: EventTypesParams) => {
  return useQuery({
    queryKey: eventTypesQueryKey(params),
    queryFn: () => fetchEventTypes(params),
  });
};
