import React from 'react';
import dynamic from 'react-dynamic-loadable';
import { store } from '../models';

// wrapper of dynamic
const dynamicWrapper = (models: string[], component: () => Promise<any>) =>
  dynamic({
    models: () =>
      models.map((m: string) => {
        return import(`../models/${m}.ts`).then((md) => {
          const modelData = md.default || md;
          store.addModel({ name: m, ...modelData });
        });
      }),
    component,
    LoadingComponent: () => <span>loading....</span>,
  });

export type RouterData = typeof getRouterData;

export const getRouterData = {
  '/login': {
    component: dynamicWrapper([], () => import('../layouts/UserLayout')),
  },
  '/login/': {
    component: dynamicWrapper(['login'], () => import('../pages/login')),
  },
  '/': {
    component: dynamicWrapper([], () => import('../layouts/BasicLayout')),
  },
  '/home': {
    component: dynamicWrapper([], () => import('../pages/home')),
  },
};
