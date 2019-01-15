import React from 'react';
import { Button } from 'uiw';
import logo from './logo.svg';
import styles from './App.module.css';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p className={styles.warpper}>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
      <div className={styles.btns}>
        <Button type="primary">主要按钮</Button>
        <Button type="success">成功按钮</Button>
        <Button type="info">信息按钮</Button>
        <Button type="warn">警告按钮</Button>
        <Button type="danger">错误按钮</Button>
      </div>
    </header>
  </div>
);

export default App;
