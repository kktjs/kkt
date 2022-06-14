import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './models';
import { routes } from './routes/router';
import ReactClient from 'react-dom/client';
export default function App() {
  const element = useRoutes(routes);
  return element;
}

ReactClient.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
