import { lazy, Suspense } from 'react';
import BasicLayout from './layouts/BasicLayout';
import LoginPage from './routes/login';
import NoMatch from './routes/NoMatch';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );

const Home = Loadable(lazy(() => import('./routes/home')));
const Help = Loadable(lazy(() => import('./routes/help/dashboard')));

export const routes = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/help',
        element: <Help />,
      },
      { path: '*', element: <NoMatch /> },
    ],
  },
];
