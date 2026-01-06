
import LeftBar from './components/leftBar/LeftBar'
import NavBar from './components/navBar/NavBar'
import RightBar from './components/rightBar/RightBar'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
import ChatWindow from './pages/messages/ChatWindow'
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
import NotFound from './pages/notfound/NotFound'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonHome from './components/skeletonHome/SkeletonHome'

const Layout = () => {
  const { darkMode } = useContext(DarkModeContext);

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}



const AfterLogin = ({ children }) => {
  const { status } = useContext(AuthContext);

  if (status === "loading") {
    return <SkeletonHome />; // ⏳ initial load
  }

  if (status === "offline") {
    return <SkeletonHome />; // 🚫 backend down
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" />;
  }

  return children;
};


const BeforeLogin = ({ children }) => {
  const { status } = useContext(AuthContext);

  if (status === "authenticated") {
    return <Navigate to="/" />;
  }

  return children;
};






function App() {
  const router = createBrowserRouter([

    {
      path: "/",// this is the parent path and could be /dashboard and children path would follow like /dashbord/profile
      element: <AfterLogin><Layout /></AfterLogin>,
      children: [
        {
          index: true, //child path should not start with /
          element: <Home />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        },
         {
          path: "/chat/:id",
          element: <ChatWindow />
        },
      ]
    },
    {
      path: "/login",
      element: <BeforeLogin><Login /></BeforeLogin>
    },
    {
      path: "/register",
      element: <BeforeLogin><Register /></BeforeLogin>
    },
    {
      path: "*",
      element: <NotFound />
    },

  ])
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App


