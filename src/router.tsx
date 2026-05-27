import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home/Home';
import LogIn from './Pages/LogIn/LogIn';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <LogIn />,
      },
    ],
  },
]);
