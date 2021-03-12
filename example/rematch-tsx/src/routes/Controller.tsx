import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch, RootState } from '../models';
import { getRouterData } from '../routes/router';

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps &
  DispatchProps & {
    routerData: typeof getRouterData;
  };

const mapState = ({ global }: RootState) => ({
  // token: global.token,
  // userData: global.userData,
});

const mapDispatch: any = (dispatch: Dispatch) => ({
  // verify: dispatch.global.verify,
  // verify: global.verify,
});

class Controller extends React.PureComponent<Props> {
  componentDidMount() {
    // this.props.verify();
  }
  render() {
    const { routerData } = this.props;
    // console.log('this.props:', this.props)
    const BasicLayout = routerData['/'].component;
    const UserLayout = routerData['/login'].component;
    // isAuthenticated = true 表示身份经过验证
    // 请求是否登录验证
    // if (!this.props.isAuthenticated) {
    //   return (
    //     <span>是否登录的验证</span>
    //   );
    // }
    // resetProps.token = token;
    // resetProps.userData = userData;
    return (
      <Switch>
        <Route path="/login" render={(props) => <UserLayout {...props} routerData={routerData} />} />
        <Route path="/" render={(props) => <BasicLayout {...props} routerData={routerData} />} />
      </Switch>
    );
  }
}

export default connect(mapState, mapDispatch)(Controller);
