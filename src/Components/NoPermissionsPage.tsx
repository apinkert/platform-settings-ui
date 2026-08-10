import { useEffect } from 'react';

import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { useAppServices } from '../shared/ServiceContext';

const NoPermissionsPage = () => {
  const { appAction } = useAppServices();

  useEffect(() => {
    appAction('no-permissions');
  }, [appAction]);

  return (
    <main>
      <NotAuthorized serviceName="Platform Settings" />
    </main>
  );
};

export default NoPermissionsPage;
