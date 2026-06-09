import { useAuth } from "../../context/AuthContext";

export default function AdminSettings() {
  const { adminUser, adminLogout } = useAuth();

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
