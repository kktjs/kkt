import { Link } from 'react-router-dom';
import styles from './index.module.less';
import { useAuth } from '../AuthProvider';

export default function GlobalHeader() {
  let auth = useAuth();
  // let navigate = useNavigate();
  // console.log('auth:', auth, navigate)
  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <Link to="/"> 首页 </Link>
        <div className={styles.right}>
          {auth.user ? <Link to="/"> 你好！{auth.user || '-'} </Link> : <Link to="/login"> 登录 </Link>}
          {auth.user && <Link to="/login"> 退出登录 </Link>}
        </div>
      </div>
    </div>
  );
}
