import React, { PureComponent } from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import styles from './BasicLayout.module.less';
import { DefaultProps } from '../';
import { RouterData } from '../routes/router';

class BasicLayout extends PureComponent<DefaultProps> {
  render() {
    const { routerData } = this.props;
    const RouteComponents: JSX.Element[] = [];
    Object.keys(routerData).forEach((path, idx) => {
      if (path === '/') {
        RouteComponents.push(<Route exact key={idx + 1} path="/" render={() => <Redirect to="/home" />} />);
      } else {
        const ChildComponent = (props: RouteComponentProps<any, StaticContext, unknown>) => {
          const ChildComp = routerData[path as keyof RouterData].component as any;
          // 可以给子组件传一些参数如： isNavShow=true
          return (
            <ChildComp {...props} isNavShow />
          );
        };
        RouteComponents.push(<Route exact key={idx + 1} path={path} render={ChildComponent} />);
      }
    });
    return (
      <div className={styles.container}>
        Basic Layout
        <Switch>
          {RouteComponents}
        </Switch>
      </div>
    );
  }
}

export default BasicLayout