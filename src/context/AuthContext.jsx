import React, { createContext, useContext, useEffect, useState } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // {id, name, role, email}
  const [loading, setLoading] = useState(true); // while checking session

  // Restore user from cookie on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.getMe();
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (formData) => {
    const res = await authApi.login(formData);

    // After login, get the latest user info
    const me = await authApi.getMe();
    setUser(me.data.user);
    console.log("Logged in user:", me.data.user);

    return res.data;
  };

  const signup = async (formData) => {
    const res = await authApi.signup(formData);
    return res.data;
  };

  const logout = () => {
    // Clear cookie by expiring it
    document.cookie = "accessToken=; Max-Age=0; path=/;";
    document.cookie = "refreshToken=; Max-Age=0; path=/;";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
