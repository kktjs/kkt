import React from 'react';
import ReactDOM from 'react-dom';
import { Router, withRouter, RouteComponentProps,  } from 'react-router-dom';
import * as H from 'history';
import { StaticContext } from 'react-router';
import { Provider } from 'react-redux';
import history from './routes/history';
import { store } from './models';
import Controller from './routes/Controller';
import { getRouterData } from './routes/router';

export type DefaultProps = React.PropsWithChildren<RouteComponentProps<any, StaticContext, H.LocationState>> & {
  routerData: typeof getRouterData;
}

const Container = withRouter((props) => {
  const routerData = getRouterData;
  const resetProps: DefaultProps = { ...props, routerData };
  return (
    <Controller {...resetProps} />
  );
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Container />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
