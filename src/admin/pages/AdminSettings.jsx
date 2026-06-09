import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSettings() {
  const { adminUser, adminToken, adminLogout, changeAdminPassword } = useAuth();
  const navigate = useNavigate();

  const [passwordChangedAt, setPasswordChangedAt] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!adminToken) return;

    fetch("/api/admin/account", {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.passwordChangedAt) {
          setPasswordChangedAt(data.passwordChangedAt);
        }
      })
      .catch(() => {});
  }, [adminToken]);

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await changeAdminPassword(currentPassword, newPassword);
    setSubmitting(false);

    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }

    setPasswordSuccess(result.message);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      navigate("/admin-login", { replace: true });
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wider text-red-800">
          Configuration
        </p>
        <h1 className="mt-1 text-3xl font-black text-zinc-950">Settings</h1>
        <p className="mt-2 text-zinc-600">
          Manage your staff account and restaurant preferences.
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-zinc-950">Staff account</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Name</dt>
              <dd className="font-bold">{adminUser?.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Role</dt>
              <dd className="font-bold capitalize">{adminUser?.role}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Last login</dt>
              <dd className="font-bold">
                {adminUser?.loginTime
                  ? new Date(adminUser.loginTime).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Password last changed</dt>
              <dd className="font-bold">
                {passwordChangedAt
                  ? new Date(passwordChangedAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={adminLogout}
            className="mt-5 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-black text-white hover:bg-zinc-800"
          >
            Sign out
          </button>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-zinc-950">Change password</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Update the staff login password. You will be signed out and must log
            in again with the new password.
          </p>

          <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
            />
            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              hint="At least 8 characters"
            />
            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
            />

            {passwordError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-800">
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p className="rounded-lg bg-green-50 p-3 text-sm font-bold text-green-800">
                {passwordSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-red-800 px-4 py-2.5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
            >
              {submitting ? "Updating..." : "Update password"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-zinc-950">Restaurant info</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Restaurant</dt>
              <dd className="font-bold">Zu Burger Spot</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Location</dt>
              <dd className="font-bold">Shashemene</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Currency</dt>
              <dd className="font-bold">ETB</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, autoComplete, hint }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-zinc-700">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-lg border border-zinc-200 px-3 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
        required
      />
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}
