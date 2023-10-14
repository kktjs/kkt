import { RouteObject } from 'react-router-dom';
import { ErrorPage } from './comps/ErrorPage';

export const routes: RouteObject = {
  path: '/',
  lazy: () => import('./comps/Layout'),
  ErrorBoundary: ErrorPage,
  children: [
    {
      path: '/',
      lazy: () => import('./pages/home'),
    },
    {
      path: '/about',
      lazy: () => import('./pages/about'),
    },
  ],
};
