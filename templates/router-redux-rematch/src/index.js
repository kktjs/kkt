import React from 'react';
import ReactDOM from 'react-dom';
import { init } from '@rematch/core';
import { Provider } from 'react-redux';
import RouterControl from './RouterControl';
import * as models from './models/global';
import './styles/index.less';

const store = init({
  models,
});

ReactDOM.render(
  <Provider store={store}>
    <RouterControl />
  </Provider>,
  document.getElementById('root'),
);
