import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition";
const linkIdle = "text-slate-300 hover:bg-slate-800 hover:text-white";
const linkActive = "bg-indigo-600 text-white";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const onLogout = () => { logout(); nav("/login"); };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col bg-slate-900 p-4 md:flex">
        <Link to="/" className="mb-6 px-2 text-xl font-bold text-white">Team Task Manager</Link>
        <nav className="flex flex-col gap-1">
          <NavLink end to="/" className={({isActive}) => `${linkBase} ${isActive?linkActive:linkIdle}`}>Dashboard</NavLink>
          <NavLink to="/projects" className={({isActive}) => `${linkBase} ${isActive?linkActive:linkIdle}`}>Projects</NavLink>
          <NavLink to="/tasks" className={({isActive}) => `${linkBase} ${isActive?linkActive:linkIdle}`}>Tasks</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/team" className={({isActive}) => `${linkBase} ${isActive?linkActive:linkIdle}`}>Team Members</NavLink>
          )}
        </nav>
        <div className="mt-auto rounded-lg bg-slate-800 p-3 text-sm text-slate-200">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-xs text-slate-400">{user?.email}</div>
          <span className="mt-2 inline-block rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300 capitalize">{user?.role}</span>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-3">
          <div className="text-lg font-semibold">Team Task Manager</div>
          <button onClick={onLogout} className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800">
            Logout
          </button>
        </header>
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
