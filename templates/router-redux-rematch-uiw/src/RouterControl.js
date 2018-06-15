import React from 'react';
import { BrowserRouter, Switch, withRouter, Route } from 'react-router-dom';
import { getRouterData } from './common/router';

const RoutersContainer = withRouter(({ history, location }) => {
  const routerData = getRouterData();
  const BasicLayout = routerData['/'].component;
  const resetProps = {
    location,
    history,
    routerData,
  };
  return (
    <Switch>
      <Route path="/" render={props => <BasicLayout {...props} {...resetProps} />} />
    </Switch>
  );
});

export default () => (
  <BrowserRouter>
    <RoutersContainer />
  </BrowserRouter>
);
