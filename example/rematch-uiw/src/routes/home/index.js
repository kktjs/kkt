import React, { PureComponent } from 'react';
import { Button } from 'uiw';
import styles from './index.module.less';

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.warpper}>
        <Button>按钮</Button>
        <div>这里是首页</div>
      </div>
    );
  }
}
