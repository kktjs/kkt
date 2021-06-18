import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import GitHubCorners from '@uiw/react-github-corners';
import logo from './logo.svg';
import Button from '../';
import MDStr from '../README.md';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <GitHubCorners fixed href="https://github.com/kktjs/kkt" />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <div>
          <Button type="primary">Primary</Button>
          <Button type="success">Success</Button>
          <Button type="warning">Warning</Button>
          <Button type="danger">Danger</Button>
          <Button type="light">Light</Button>
          <Button type="dark">Dark</Button>
        </div>
      </header>
      <MarkdownPreview source={MDStr} className="info" />
    </div>
  );
};

export default App;
