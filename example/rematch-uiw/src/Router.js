import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

function RoutersController(props = {}) {
  const { resetProps, token, userData } = props;
  const BasicLayout = resetProps.routerData['/'].component;
  const UserLayout = resetProps.routerData['/login'].component;
  const HelpLayout = resetProps.routerData['/help'].component;
  useEffect(() => {
    props.verify();
  }, [])
  // isAuthenticated = true 表示身份经过验证
  // 请求是否登录验证
  if (!props.isAuthenticated) {
    return <span>是否登录的验证</span>;
  }
  resetProps.token = token;
  resetProps.userData = userData;
  return (
    <Switch>
      <Route path="/login" render={(props) => <UserLayout {...props} {...resetProps} />} />
      <Route path="/help" render={(props) => <HelpLayout {...props} {...resetProps} />} />
      <Route path="/" render={(props) => <BasicLayout {...props} {...resetProps} />} />
    </Switch>
  );
}

const mapState = ({ global }) => ({
  isAuthenticated: global.isAuthenticated,
  token: global.token,
  userData: global.userData,
});

const mapDispatch = ({ global }) => ({
  verify: global.verify,
});

export default connect(mapState, mapDispatch)(RoutersController);
