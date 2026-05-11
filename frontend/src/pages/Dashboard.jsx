import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function Stat({ label, value, tone = "indigo" }) {
  const tones = {
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
  };
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-5 text-white shadow`}>
      <div className="text-sm opacity-80">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/tasks"), api.get("/projects")])
      .then(([t, p]) => { setTasks(t.data); setProjects(p.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Loading…</div>;

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const pending = tasks.filter((t) => t.status !== "Done").length;
  const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "Done").length;
  const mine = tasks.filter((t) => t.assignedTo?._id === user._id);
  const recent = [...tasks].slice(0, 5);

  const COLORS = ['#10b981', '#f59e0b', '#f43f5e', '#6366f1'];
  
  const statusData = [
    { name: 'Completed', value: done },
    { name: 'Pending', value: pending },
  ].filter(d => d.value > 0);

  const projectData = projects.map(p => {
    const ts = tasks.filter((t) => t.project?._id === p._id);
    return {
      name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
      Total: ts.length,
      Completed: ts.filter((t) => t.status === "Done").length
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <p className="text-sm text-slate-500">Here's what's happening across your team.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total tasks" value={total} tone="indigo" />
        <Stat label="Completed" value={done} tone="emerald" />
        <Stat label="Pending" value={pending} tone="amber" />
        <Stat label="Overdue" value={overdue} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Tasks by Status</h2>
          <div className="h-64">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">No data</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Tasks per Project</h2>
          <div className="h-64">
            {projectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend />
                  <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Recent tasks</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr><th className="pb-2">Title</th><th className="pb-2">Project</th><th className="pb-2">Assignee</th><th className="pb-2">Status</th></tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="py-2">{t.title}</td>
                  <td>{t.project?.title || "—"}</td>
                  <td>{t.assignedTo?.name || "Unassigned"}</td>
                  <td><StatusBadge status={t.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-400">No tasks yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Project stats</h2>
          <ul className="space-y-3">
            {projects.map((p) => {
              const ts = tasks.filter((t) => t.project?._id === p._id);
              const d = ts.filter((t) => t.status === "Done").length;
              const pct = ts.length ? Math.round((d / ts.length) * 100) : 0;
              return (
                <li key={p._id}>
                  <div className="mb-1 flex justify-between text-sm"><span>{p.title}</span><span className="text-slate-500">{d}/{ts.length}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
            {projects.length === 0 && <li className="text-sm text-slate-400">No projects yet.</li>}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold">My assigned tasks</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr><th className="pb-2">Title</th><th className="pb-2">Project</th><th className="pb-2">Deadline</th><th className="pb-2">Status</th></tr>
          </thead>
          <tbody>
            {mine.map((t) => (
              <tr key={t._id} className="border-t">
                <td className="py-2">{t.title}</td>
                <td>{t.project?.title || "—"}</td>
                <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</td>
                <td><StatusBadge status={t.status} /></td>
              </tr>
            ))}
            {mine.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-slate-400">Nothing assigned to you.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
