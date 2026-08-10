import { useEffect } from 'react';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { useAppServices } from '../shared/ServiceContext';

const OopsPage = () => {
  const { appAction } = useAppServices();

  useEffect(() => {
    appAction('oops-page');
  }, [appAction]);

  return (
    <main>
      <Unavailable />
    </main>
  );
};

export default OopsPage;
