import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';

export default class UserLayout extends PureComponent {
  render() {
    const { routerData } = this.props;
    const RouteComponents = [];
    Object.keys(routerData).forEach((path, idx) => {
      if (/^(\/login)/.test(path) && !/^(\/login)$/.test(path)) {
        RouteComponents.push(<Route exact key={idx + 1} path={path} component={routerData[path].component} />);
      }
    });
    return <Switch>{RouteComponents}</Switch>;
  }
}
