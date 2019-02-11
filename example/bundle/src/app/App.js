import React from 'react';
import logo from './logo.svg';
import styles from './App.module.css';
import { Button } from '../components';
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
      <div>
        <Button icon="weibo" type="primary">主要按钮</Button>
        <Button icon="chrome" type="success">成功按钮</Button>
        <Button icon="taobao" type="warning">警告按钮</Button>
        <Button icon="weibo" type="danger" />
        <Button type="danger">错误按钮</Button>
        <Button icon="chrome" type="light">亮按钮</Button>
        <Button icon="apple" type="dark">暗按钮</Button>
        <Button type="dark">暗按钮</Button>
      </div>
    </header>
  </div>
);

export default App;
