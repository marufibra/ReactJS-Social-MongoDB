
import LeftBar from './components/leftBar/LeftBar'
import NavBar from './components/navBar/NavBar'
import RightBar from './components/rightBar/RightBar'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import './style.scss'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { DarkModeContext } from './Context/darkModeContext'
import { useContext } from 'react'
import { AuthContext } from './Context/AuthContext'


const Layout = () => {
  const { darkMode } = useContext(DarkModeContext);


  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <NavBar />
      <div style={{ display: 'flex' }}>
        <LeftBar />
        <div style={{ flex: 6 }}>
          <Outlet />
        </div>
        <RightBar />
      </div>
    </div>
  )
}



const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  return children;
}


function App() {



  const router = createBrowserRouter([

    {
      path: "/",// this is the parent path and could be /dashboard and children path would follow like /dashbord/profile
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          index: true, //child path should not start with /
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        }
      ]
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
  ])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App


