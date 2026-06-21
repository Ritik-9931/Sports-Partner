import { useEffect, useState } from "react";
import api from "../service/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setActionLoading(userId);

      const { data } = await api.put(`/admin/users/${userId}/role`, { role });

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? data.user : user))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    } finally {
      setActionLoading("");
    }
  };

  const handleBlockToggle = async (userId) => {
    try {
      setActionLoading(userId);

      const { data } = await api.put(`/admin/users/${userId}/block`);

      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? data.user : user))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status");
    } finally {
      setActionLoading("");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(userId);

      await api.delete(`/admin/users/${userId}`);

      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading("");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchValue = `${user.name} ${user.email} ${user.city || ""} ${
      user.state || ""
    } ${user.role}`.toLowerCase();

    return searchValue.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold">Manage Users</h1>
            <p className="mt-2 text-slate-400">
              Manage user roles, block accounts, and remove users.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3">
              <p className="text-sm text-slate-400">Total</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3">
              <p className="text-sm text-slate-400">Blocked</p>
              <p className="text-2xl font-bold text-red-400">
                {users.filter((user) => user.isBlocked).length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900 p-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
          />
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-slate-400">
            Loading users...
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="px-5 py-4 text-sm text-slate-300">User</th>
                    <th className="px-5 py-4 text-sm text-slate-300">Role</th>
                    <th className="px-5 py-4 text-sm text-slate-300">
                      Location
                    </th>
                    <th className="px-5 py-4 text-sm text-slate-300">
                      Online
                    </th>
                    <th className="px-5 py-4 text-sm text-slate-300">
                      Account
                    </th>
                    <th className="px-5 py-4 text-sm text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-violet-500 font-bold">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              user.name?.charAt(0)?.toUpperCase()
                            )}
                          </div>

                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          disabled={actionLoading === user._id}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-violet-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-300">
                        {user.city || user.state
                          ? `${user.city || ""}${
                              user.city && user.state ? ", " : ""
                            }${user.state || ""}`
                          : "Not added"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isOnline
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {user.isOnline ? "Online" : "Offline"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isBlocked
                              ? "bg-red-500/10 text-red-300"
                              : "bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleBlockToggle(user._id)}
                            disabled={actionLoading === user._id}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${
                              user.isBlocked
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-amber-500 hover:bg-amber-600"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={actionLoading === user._id}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-5 py-8 text-center text-slate-400"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;