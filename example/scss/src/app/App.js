import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.module.scss';
import './App.css';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/app/App.js</code> and save to reload.
          </p>
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
}

export default App;
