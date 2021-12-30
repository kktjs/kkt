import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './models';
import { routes } from './routes/router';

export default function App() {
  const element = useRoutes(routes);
  return element;
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
