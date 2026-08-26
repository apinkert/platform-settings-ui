import { Suspense, lazy, useMemo } from 'react';
import type { ComponentType } from 'react';
import { Route as RouterRoute, Routes as RouterRoutes } from 'react-router-dom';
import { Bullseye } from '@patternfly/react-core/dist/dynamic/layouts/Bullseye';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';

const AlertManagerPage = lazy(
  () =>
    import(
      /* webpackChunkName: "AlertManagerPage" */ './features/alert-manager/features/alertmanager/components/AlertManagerPage'
    ),
);
const OopsPage = lazy(
  () => import(/* webpackChunkName: "OopsPage" */ './Components/OopsPage'),
);
const NoPermissionsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "NoPermissionsPage" */ './Components/NoPermissionsPage'
    ),
);
const EventLogPage = lazy(
  () =>
    import(
      /* webpackChunkName: "EventLogPage" */ './features/alert-manager/features/event-log/EventLogPage'
    ),
);

const LandingPage = () => (
  <Bullseye>
    <p>Platform Settings</p>
  </Bullseye>
);

const routes = [
  {
    path: 'alertmanager',
    element: AlertManagerPage,
  },
  {
    path: 'eventlog',
    element: EventLogPage,
  },
  {
    path: 'no-permissions',
    element: NoPermissionsPage,
  },
  {
    path: 'oops',
    element: OopsPage,
  },
  {
    path: '/',
    element: LandingPage,
  },
  {
    path: '*',
    element: LandingPage,
  },
];

interface RouteType {
  path?: string;
  element: ComponentType;
  childRoutes?: RouteType[];
  elementProps?: Record<string, unknown>;
}

const renderRoutes = (routes: RouteType[] = []) =>
  routes.map(({ path, element: Element, childRoutes, elementProps }) => (
    <RouterRoute key={path} path={path} element={<Element {...elementProps} />}>
      {renderRoutes(childRoutes)}
    </RouterRoute>
  ));

const Routing = () => {
  const renderedRoutes = useMemo(() => renderRoutes(routes), [routes]);
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <RouterRoutes>{renderedRoutes}</RouterRoutes>
    </Suspense>
  );
};

export default Routing;
