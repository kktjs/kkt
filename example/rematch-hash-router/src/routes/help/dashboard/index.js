import React, { PureComponent } from 'react';
import styles from './index.module.less';

export default class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.warpper}>
        帮助页面首页
      </div>
    );
  }
}
