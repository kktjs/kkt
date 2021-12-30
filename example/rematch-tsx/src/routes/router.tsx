import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
// import { store } from '../models';

export default function NoMatch() {
  return (
    <div>
      <h2>It looks like you're lost...</h2>
    </div>
  );
}

const Loadable = (Component: React.LazyExoticComponent<() => JSX.Element>, models?: string[]) => (props: any) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};

const BasicLayout = Loadable(lazy(() => import('../layouts/BasicLayout')));
const LoginPage = Loadable(lazy(() => import('../pages/login')));
const Home = Loadable(lazy(() => import('../pages/home')));

export const routes: RouteObject[] = [
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
      { path: '*', element: <NoMatch /> },
    ],
  },
];
