import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import styles from './HelpLayout.module.less';

export default class HelpLayout extends PureComponent {
  render() {
    const { routerData } = this.props;
    const RouteComponents = [];
    Object.keys(routerData).forEach((path, idx) => {
      if (/^(\/help)/.test(path) && path !== '/help') {
        const ChildComponent = (props) => {
          const { match } = props;
          const ChildComp = routerData[path].component;
          // 可以给子组件传一些参数如： isNavShow=true
          return (
            <div>
              {match.params.id && `This page: ${match.params.id}`}
              <ChildComp {...props} isNavShow />
            </div>
          );
        };
        RouteComponents.push(
          <Route exact key={idx + 1} path={path} render={ChildComponent} />
        );
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
