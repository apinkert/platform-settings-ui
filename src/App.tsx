import { useEffect, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import ErrorBoundary from './Components/ErrorBoundary';
import Routing from './Routing';
import { QueryClientSetup } from './shared/QueryClientSetup';
import { ServiceProvider } from './shared/ServiceContext';
import { createBrowserServices } from './shared/AppServices.browser';
import './App.scss';

const AppWithServices = () => {
  const chrome = useChrome();
  const addNotification = useAddNotification();
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    chrome.auth.getUser().then((user) => {
      setIsOrgAdmin(
        (user as { identity?: { user?: { is_org_admin?: boolean } } })?.identity
          ?.user?.is_org_admin ?? false,
      );
    });
  }, [chrome]);

  const services = useMemo(
    () => createBrowserServices(chrome, addNotification, isOrgAdmin),
    [chrome, addNotification, isOrgAdmin],
  );

  return (
    <ServiceProvider value={services}>
      <QueryClientSetup>
        <ErrorBoundary>
          <Routing />
        </ErrorBoundary>
      </QueryClientSetup>
    </ServiceProvider>
  );
};

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    updateDocumentTitle('Platform Settings');
  }, []);

  return (
    <IntlProvider locale="en" defaultLocale="en">
      <NotificationsProvider>
        <AppWithServices />
      </NotificationsProvider>
    </IntlProvider>
  );
};

export default App;
