import { useQuery } from '@tanstack/react-query';
import { useAppServices } from '../../../../shared/ServiceContext';
import { createBundlesApi } from '../api/bundles';
import type { BundleFacet } from '../types/bundles.types';

export const bundlesKeys = {
  all: ['bundles'] as const,
  facets: () => [...bundlesKeys.all, 'facets'] as const,
};

export function useBundleFacets() {
  const { axios } = useAppServices();
  const api = createBundlesApi(axios);

  return useQuery<BundleFacet[]>({
    queryKey: bundlesKeys.facets(),
    queryFn: async () => {
      const response = await api.notificationResourceV1GetBundleFacets({
        includeApplications: false,
      });
      return response.data as BundleFacet[];
    },
    staleTime: 10 * 60 * 1000,
  });
}
