import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { DefaultProps } from '../';
import { RouterData } from '../routes/router';

class UserLayout extends PureComponent<DefaultProps> {
  render() {
    const { routerData } = this.props;
    const RouteComponents: JSX.Element[] = [];
    Object.keys(routerData).forEach((path, idx) => {
      if (/^(\/login)/.test(path) && !/^(\/login)$/.test(path)) {
        RouteComponents.push(<Route exact key={idx + 1} path={path} component={routerData[path as  keyof RouterData].component as any} />);
      }
    });
    return (
      <Switch>
        {RouteComponents}
      </Switch>
    );
  }
}

export default UserLayout;