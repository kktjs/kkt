import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.less';

export default class index extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { username } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.inner}>
          <Link to="/"> 首页 </Link>
          <div className={styles.right}>
            {username ? <Link to="/"> 你好！{username || '-'} </Link> : <Link to="/login"> 登录 </Link>}
            {username && <Link to="/login"> 退出登录 </Link>}
          </div>
        </div>
      </div>
    );
  }
}
