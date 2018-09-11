import React, { PureComponent } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './BasicLayout.less';

class BasicLayout extends PureComponent {
  logout() {
    this.props.logout();
  }
  render() {
    const { routerData, token, username } = this.props;
    const RouteComponents = [];
    Object.keys(routerData).forEach((path, idx) => {
      if (path === '/') {
        RouteComponents.push(<Route exact key={idx + 1} path="/" render={() => <Redirect to="/home" />} />);
      } else {
        const ChildComponent = (props) => {
          const ChildComp = routerData[path].component;
          // 可以给子组件传一些参数如： isNavShow=true
          return (
            <ChildComp {...props} isNavShow />
          );
        };
        RouteComponents.push(
          <Route exact key={idx + 1} path={path} render={ChildComponent} />
        );
      }
    });
    return (
      <div className={styles.fullpage}>
        <div className={styles.header}>
          <div className={styles.inner}>
            <Link to="/"> 首页 </Link>
            <div className={styles.right}>
              {token ? <Link to="/"> 你好！{username || '-'} </Link> : <Link to="/login"> 登录 </Link>}
              {token && <Link to="/login"> 退出登录 </Link>}
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <Switch>
            {RouteComponents}
            <Route render={() => <Redirect to="/home" />} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapState = ({ global, user }) => ({
  test: global.test,
  token: user.token,
  username: user.username,
});

export default connect(mapState)(BasicLayout);
