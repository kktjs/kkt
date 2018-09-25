import React from 'react';
import ReactDOM from 'react-dom';
import { Router, withRouter } from 'react-router-dom';
import { init } from '@rematch/core';
import { Provider } from 'react-redux';
import history from './history';
import * as models from './models/global';
import { getRouterData } from './common/router';
import RoutersController from './Router';
import './styles/index.less';

const RoutersContainer = withRouter(({ history: historyData, location }) => {
  const routerData = getRouterData();
  const resetProps = {
    location,
    history: historyData,
    routerData,
  };
  return (
    <RoutersController resetProps={resetProps} />
  );
});

const store = init({
  models,
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <RoutersContainer />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
