import React, { PureComponent } from 'react';
import styles from './index.less';

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.warpper}>
        这里是首页
      </div>
    );
  }
}
