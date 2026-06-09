import { Lock } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import zuLogo from "../../assets/images/zu-logo-social.jpg";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { isAdminAuthenticated, adminLogin, isLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await adminLogin(password);
    setSubmitting(false);

    if (result.ok) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    setError(result.error || "Invalid credentials.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src={zuLogo}
            alt="Zu Burger Spot"
            className="mx-auto size-20 rounded-full border-4 border-yellow-400 object-cover"
          />
          <h1 className="mt-4 text-2xl font-black text-white">Staff Login</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Restaurant administration portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-300">
              Staff password
            </span>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-950 pl-10 pr-4 text-white outline-none focus:border-red-700 focus:ring-4 focus:ring-red-900/40"
                placeholder="Enter staff password"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error && (
            <p className="mt-3 rounded-lg bg-red-950/50 p-3 text-sm font-bold text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 h-12 w-full rounded-lg bg-red-800 font-black text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in to dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Authorized restaurant staff only
        </p>
      </div>
    </div>
  );
}
