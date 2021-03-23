import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Dispatch } from '../models';
import { getRouterData } from '../routes/router';
import { DefaultProps } from '../';

type Props = {
  routerData: typeof getRouterData;
} & DefaultProps;

export default function Controller(props: Props) {
  const { routerData } = props || {};
  const dispatch = useDispatch<Dispatch>();
  // const token = useSelector(({ global }: RootState) => global.token)
  const BasicLayout: any = routerData['/'].component;
  const UserLayout: any = routerData['/login'].component;
  useEffect(() => {
    if (!/^(\/login)/.test(window.location.pathname)) {
      dispatch.global.verify();
    }
    // eslint-disable-next-line
  }, []);
  return (
    <Switch>
      <Route path="/login" render={(props) => <UserLayout {...props} routerData={routerData} />} />
      <Route path="/" render={(props) => <BasicLayout {...props} routerData={routerData} />} />
    </Switch>
  );
}

// type StateProps = ReturnType<typeof mapState>;
// type DispatchProps = ReturnType<typeof mapDispatch>;
// type Props = StateProps &
//   DispatchProps & {
//     routerData: typeof getRouterData;
//   };

// const mapState = ({ global }: RootState) => ({
//   // token: global.token,
//   // userData: global.userData,
// });

// const mapDispatch: any = (dispatch: Dispatch) => ({
//   // verify: dispatch.global.verify,
//   // verify: global.verify,
// });

// class Controller extends React.PureComponent<Props> {
//   componentDidMount() {
//     // this.props.verify();
//   }
//   render() {
//     const { routerData } = this.props;
//     // console.log('this.props:', this.props)
//     const BasicLayout = routerData['/'].component;
//     const UserLayout = routerData['/login'].component;
//     // isAuthenticated = true 表示身份经过验证
//     // 请求是否登录验证
//     // if (!this.props.isAuthenticated) {
//     //   return (
//     //     <span>是否登录的验证</span>
//     //   );
//     // }
//     // resetProps.token = token;
//     // resetProps.userData = userData;
//     return (
//       <Switch>
//         <Route path="/login" render={(props) => <UserLayout {...props} routerData={routerData} />} />
//         <Route path="/" render={(props) => <BasicLayout {...props} routerData={routerData} />} />
//       </Switch>
//     );
//   }
// }

// export default connect(mapState, mapDispatch)(Controller);
