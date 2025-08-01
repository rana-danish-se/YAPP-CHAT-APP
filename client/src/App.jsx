import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Auth from './pages/auth';
import Chat from './pages/chat';
import Profile from './pages/profile';
import { useAppStore } from './store';
import { apiClient } from './lib/api-client';
import { GET_USER_INFO } from './utils/constants';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);



 

useEffect(() => {
  const getUserData = async () => {
    try {
      const response = await apiClient.get(GET_USER_INFO, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserInfo(response.data.user);
      } else {
        setUserInfo(undefined);
      }
    } catch (error) {
      console.log(error);
      setUserInfo(undefined);
    } finally {
      setLoading(false);
    }
  };

  getUserData(); 
}, [setUserInfo]);



  return loading ? (
    <div>Loading....</div>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
