import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading] = useState(false);

  // ================= REGISTER =================
  const signUp = async ({ fullName, email, password }) => {
    try {
      const res = await API.post("/auth/register", {
        fullName,
        email,
        password,
      });

      return {
        data: res.data,
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err.response?.data?.message || "Registration failed",
        },
      };
    }
  };

  // ================= LOGIN =================
  const signIn = async ({ email, password }) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return {
        data: res.data,
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err.response?.data?.message || "Invalid credentials",
        },
      };
    }
  };

  // ================= LOGOUT =================
  const signOut = async () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ================= UPDATE PROFILE =================
  const updateProfile = async ({ fullName }) => {
    try {
      const res = await API.put(`/auth/profile/${user.id}`, {
        fullName,
      });

      const updatedUser = {
        ...user,
        fullName,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return {
        data: res.data,
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err.response?.data?.message ||
            "Could not update profile",
        },
      };
    }
  };

  // ================= CHANGE PASSWORD =================
  const changePassword = async ({ newPassword }) => {
    try {
      const res = await API.put(`/auth/password/${user.id}`, {
        newPassword,
      });

      return {
        data: res.data,
        error: null,
      };
    } catch (err) {
      return {
        data: null,
        error: {
          message:
            err.response?.data?.message ||
            "Could not change password",
        },
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session: user,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}