import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Profile from "./pages/profile/Profile"
import Register from "./pages/register/Register"
import UseReducerExercise from "./pages/exercise/useReducer/UseReducer"
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,

} from "react-router-dom";
import NotFound from './pages/notfound/NotFound'
import { useContext } from "react"
import { AuthContext } from "./context/AuthCreateContext"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Messenger from "./pages/messenger/Messenger"



const App = () => {
  const { user } = useContext(AuthContext)


  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? <Home /> : <Navigate to="/login" replace />,
     
    },
    {
      path: "/messenger",
      element: user ? <Messenger /> : <Navigate to="/login" replace />,
    },
    {
      path: "/profile/:username",
      element: user ? <Profile /> : <Navigate to="/login" replace />,
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/register",
      element: user ? <Navigate to="/" replace /> : <Register />,
    },
    {
      path: "/usereducer",
      element: (
        <UseReducerExercise />
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>

      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}




export default App
