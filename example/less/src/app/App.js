import React, { Component } from 'react';
import Button from '@kkt/button';
import logo from './logo.svg';
import styles from './App.module.less';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <p>
            Edit <code>src/app/App.js</code> and save to reload.
          </p>
          <div>
            <a
              className={styles.AppLink}
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            <a
              className={styles.AppLink}
              href="https://github.com/jaywcjlove/kkt"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn KKT
            </a>
          </div>
          <div className={styles.btns}>
            <Button type="primary">Primary</Button>
            <Button type="success">Success</Button>
            <Button type="warning">Warning</Button>
            <Button type="danger">Danger</Button>
            <Button type="light">Light</Button>
            <Button type="dark">Dark</Button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
