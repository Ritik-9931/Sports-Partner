import { useEffect, useState } from "react";
import api from "../service/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data } = await api.get("/admin/dashboard");
    setStats(data);
  };

  const statsCards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Total Games", value: stats.totalGames },
    { label: "Communities", value: stats.totalCommunities },
    { label: "Requests", value: stats.totalRequests },
    { label: "Active Users", value: stats.activeUsers },
  ];

  const actionCards = [
    {
      title: "Add Games",
      description: "Create and publish new games.",
      button: "Add Game",
      color: "bg-emerald-500",
      route: "/admin/add-games",
    },
    {
      title: "Edit Games",
      description: "Update game details and settings.",
      button: "Edit Games",
      color: "bg-blue-500",
      route: "/admin/edit-games",
    },
    {
      title: "Delete Games",
      description: "Remove games from the platform.",
      button: "Delete Games",
      color: "bg-red-500",
      route: "/admin/delete-games",
    },
    {
      title: "Manage Users",
      description: "View, block, or manage user accounts.",
      button: "Manage Users",
      color: "bg-violet-500",
      route: "/admin/manageUsers",
    },
    {
      title: "Manage Communities",
      description: "View, block, or manage communities.",
      button: "Manage Communities",
      color: "bg-purple-500",
      route: "/admin/manageCommunities",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-400">
              Manage games, users, communities, and platform activity.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-3 shadow-lg">
            <p className="text-sm text-slate-400">Admin Panel</p>
            <p className="font-semibold text-emerald-400">Online</p>
          </div>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {statsCards.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg transition hover:border-slate-700 hover:bg-slate-800"
            >
              <p className="text-sm font-medium text-slate-400">{item.label}</p>

              <h3 className="mt-4 text-3xl font-bold">{item.value ?? 0}</h3>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-5 text-2xl font-bold">Quick Actions</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {actionCards.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg ${card.color} text-lg font-bold text-white`}
                >
                  {card.title.charAt(0)}
                </div>

                <h3 className="text-xl font-semibold">{card.title}</h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                  {card.description}
                </p>

                <button
                  onClick={() => navigate(card.route)}
                  className="mt-6 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  {card.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
