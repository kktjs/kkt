import React from 'react';
import { Outlet } from 'react-router-dom';
import SiderMenu from '../components/SiderMenu';
import GlobalHeader from '../components/GlobalHeader';
import styles from './BasicLayout.module.less';

export default function BasicLayout() {
  return (
    <div className={styles.wapper}>
      <SiderMenu />
      <div className={styles.container}>
        <GlobalHeader />
        <Outlet />
      </div>
    </div>
  );
}
