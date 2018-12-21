import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import styles from './HelpLayout.module.less';

export default class HelpLayout extends PureComponent {
  render() {
    const { routerData } = this.props;
    const RouteComponents = [];
    Object.keys(routerData).forEach((path, idx) => {
      if (/^(\/help)/.test(path) && path !== '/help') {
        RouteComponents.push(<Route exact key={idx + 1} path={path} component={routerData[path].component} />);
      }
    });
    return (
      <div className={styles.container}>
        Help Layout
        <Switch>
          {RouteComponents}
        </Switch>
      </div>
    );
  }
}
