import React from 'react';
import logo from './logo.svg';
import styles from './App.module.less';
import markdown from './App.md';

export default function App() {
  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <img src={logo} className={styles.AppLogo} alt="logo" />
        <p>
          Edit <code>src/app/App.js</code> and save to reload.
        </p>
        <p>{markdown}</p>
        <div>
          <a className={styles.AppLink} href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          <a className={styles.AppLink} href="https://github.com/kktjs/kkt" target="_blank" rel="noopener noreferrer">
            Learn KKT
          </a>
        </div>
      </header>
    </div>
  );
}
