import { createBrowserRouter, RouterProvider } from 'react-router'
import DefaultLayout from '@/routes/layouts/default'
import Home from '@/routes/pages/Home'
import About from '@/routes/pages/About'
import Movies from '@/routes/pages/Movies'
import MovieDetails from '@/routes/pages/MovieDetails'
import SignIn from '@/routes/pages/SignIn'
import { requireAuth, guestOnly } from '@/routes/loaders/index'
import NotFound from '@/routes/pages/NotFound'
import Todos from './pages/Todos'

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/movies',
        loader: requireAuth,
        element: <Movies />
      },
      {
        path: '/movies/:movieId',
        loader: requireAuth,
        element: <MovieDetails />
      },
      {
        path: '/signin',
        loader: guestOnly,
        element: <SignIn />
      },
      {
        path: '/todos',
        element: <Todos />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

export default function Router() {
  return <RouterProvider router={router} />
}
