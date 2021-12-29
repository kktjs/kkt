import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { routes } from './routers';

export default function App() {
  const element = useRoutes(routes);
  return <AuthProvider>{element}</AuthProvider>;
}
