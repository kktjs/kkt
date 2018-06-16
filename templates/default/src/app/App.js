import React, { PureComponent } from 'react';
import logo from './logo.svg';
import styles from './App.less';

class App extends PureComponent {
  render() {
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <h1 className={styles.AppTitle}>Welcome to React</h1>
        </header>
        <p className={styles.AppIntro}>
          To get started, edit <code>src/index.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
