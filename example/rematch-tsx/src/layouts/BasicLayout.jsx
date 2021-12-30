import { Outlet } from 'react-router-dom';
import styles from './BasicLayout.module.less';

export default function BasicLayout() {
  return (
    <div className={styles.wapper}>
      test
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
}
