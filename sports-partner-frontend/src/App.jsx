import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectRoute";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import socket from "./socket";
import AddGame from "./pages/AddGame";
import EditGame from "./pages/EditGame";
import DeleteGame from "./pages/DeleteGame";
import ManageUsers from "./pages/ManageUsers";
import ManageCommunities from "./pages/ManageCommunities";
import Communities from "./pages/Communities";
import AddCommunity from "./pages/AddCommunity";
import EditCommunity from "./pages/EditCommunity";
import CommunityDetail from "./pages/CommunityDetail";
import Partners from "./pages/Partners";
import ViewProfile from "./pages/ViewProfile";
import PlayRequests from "./pages/playRequest";
import OTPProtectedRoute from "./routes/OTPprotectedRoute";
import OTPSystem from "./components/OTPSystem";
import UpdateUser from "./pages/UpdateUser";

const App = () => {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (socket.connected && user?._id) {
      socket.emit("user-online", user._id);
    }

    const handleConnect = () => {
      console.log("CONNECTED:", socket.id);

      if (user?._id) {
        socket.emit("user-online", user._id);
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  const myRouter = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "games",
          element: (
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          ),
        },
        {
          path: "communities",
          element: (
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          ),
        },
        {
          path: "add-community",
          element: (
            <ProtectedRoute>
              <AddCommunity />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-community/:id",
          element: (
            <ProtectedRoute>
              <EditCommunity />
            </ProtectedRoute>
          ),
        },
        {
          path: "community/:id",
          element: (
            <ProtectedRoute>
              <CommunityDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "partners",
          element: (
            <ProtectedRoute>
              <Partners />
            </ProtectedRoute>
          ),
        },
        {
          path: "viewProfile/:id",
          element: (
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          ),
        },
        {
          path: "play-requests",
          element: (
            <ProtectedRoute>
              <PlayRequests />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/dashboard",
          element: (
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          ),
        },
        {
          path: "admin/add-games",
          element: (
            <AdminRoute>
              <AddGame />
            </AdminRoute>
          ),
        },
        {
          path: "admin/edit-games",
          element: (
            <AdminRoute>
              <EditGame />
            </AdminRoute>
          ),
        },
        {
          path: "admin/delete-games",
          element: (
            <AdminRoute>
              <DeleteGame />
            </AdminRoute>
          ),
        },
        {
          path: "admin/manageUsers",
          element: (
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          ),
        },
        {
          path: "admin/manageCommunities",
          element: (
            <AdminRoute>
              <ManageCommunities />
            </AdminRoute>
          ),
        },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "otp-generate",
      element: <OTPSystem />,
    },
    {
      path: "updatePass",
      element: (
        <OTPProtectedRoute>
          <UpdateUser />
        </OTPProtectedRoute>
      ),
    },
  ]);
  return <RouterProvider router={myRouter} />;
};

export default App;
