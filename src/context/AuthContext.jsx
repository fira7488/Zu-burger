import { createContext, useContext, useEffect, useState } from "react";

const ADMIN_AUTH_KEY = "zu-burger-admin-auth";
const ADMIN_TOKEN_KEY = "zu-burger-admin-token";

const AuthContext = createContext({
  adminUser: null,
  adminToken: null,
  isAdminAuthenticated: false,
  isLoading: true,
  adminLogin: async () => ({ ok: false }),
  adminLogout: () => {},
  changeAdminPassword: async () => ({ ok: false }),
});

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ADMIN_AUTH_KEY);
      const token = window.localStorage.getItem(ADMIN_TOKEN_KEY);
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
      if (token) {
        setAdminToken(token);
      }
    } catch (error) {
      console.error("Failed to restore admin auth:", error);
      setAdminUser(null);
      setAdminToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const adminLogin = async (password) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        return { ok: false, error: result.error || "Invalid staff password." };
      }

      const user = {
        id: "admin-1",
        role: "admin",
        name: "Zu Burger Staff",
        loginTime: new Date().toISOString(),
      };
      window.localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(user));
      window.localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
      setAdminUser(user);
      setAdminToken(result.token);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach the server." };
    }
  };

  const adminLogout = () => {
    window.localStorage.removeItem(ADMIN_AUTH_KEY);
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminUser(null);
    setAdminToken(null);
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    if (!adminToken) {
      return { ok: false, error: "You must be signed in to change the password." };
    }

    try {
      const response = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        return { ok: false, error: result.error || "Could not update password." };
      }

      adminLogout();
      return { ok: true, message: result.message };
    } catch {
      return { ok: false, error: "Could not reach the server." };
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        adminToken,
        isAdminAuthenticated: Boolean(adminUser?.role === "admin" && adminToken),
        isLoading,
        adminLogin,
        adminLogout,
        changeAdminPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
