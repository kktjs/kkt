import App from './app/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ReactClient from 'react-dom/client';
ReactClient.createRoot(document.getElementById('root')!).render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
