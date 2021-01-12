import React, { Component } from 'react';
import styles from './index.module.less';

export default class SiderMenu extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return <div className={styles.wapper}>菜单</div>;
  }
}
