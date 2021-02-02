import React from 'react';
import dynamic from 'react-dynamic-loadable';
import { store } from '../store';

// wrapper of dynamic
const dynamicWrapper = (models, component) =>
  dynamic({
    models: () =>
      models.map((m) => {
        return import(`../models/${m}.js`).then((md) => {
          const modelData = md.default || md;
          store.addModel({ name: m, ...modelData });
        });
      }),
    component,
    LoadingComponent: () => <span>loading....</span>,
  });

export const getRouterData = () => {
  const conf = {
    '/help': {
      component: dynamicWrapper(['user'], () => import('../layouts/HelpLayout')),
    },
    '/help/': {
      component: dynamicWrapper(['user'], () => import('../routes/help/dashboard')),
    },
    '/help/:id': {
      component: dynamicWrapper(['user'], () => import('../routes/help/dashboard')),
    },
    '/login': {
      component: dynamicWrapper(['user'], () => import('../layouts/UserLayout')),
    },
    '/login/': {
      component: dynamicWrapper(['user'], () => import('../routes/login')),
    },
    '/': {
      component: dynamicWrapper(['user'], () => import('../layouts/BasicLayout')),
    },
    '/home': {
      component: dynamicWrapper([], () => import('../routes/home')),
    },
  };
  return conf;
};
