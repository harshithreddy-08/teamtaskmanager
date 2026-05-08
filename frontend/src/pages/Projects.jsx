import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", members: [] });

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/projects");
    setProjects(data);
    setLoading(false);
  };
  useEffect(() => { load(); if (isAdmin) api.get("/users").then(({data}) => setUsers(data)).catch(()=>{}); }, []);

  const openNew = () => { setEditing(null); setForm({ title:"", description:"", members:[] }); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ title: p.title, description: p.description, members: p.members.map(m => m._id) }); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/projects/${editing._id}`, form);
        toast.success("Project updated");
      } else {
        await api.post("/projects", form);
        toast.success("Project created");
      }
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"? All its tasks will be removed.`)) return;
    await api.delete(`/projects/${p._id}`);
    toast.success("Deleted");
    load();
  };

  const toggleMember = (id) => {
    setForm((f) => ({ ...f, members: f.members.includes(id) ? f.members.filter((x) => x !== id) : [...f.members, id] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        {isAdmin && <button onClick={openNew} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ New project</button>}
      </div>

      {loading ? <div className="text-slate-500">Loading…</div> : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p._id} className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                {isAdmin && (
                  <div className="flex gap-2 text-sm">
                    <button onClick={() => openEdit(p)} className="text-indigo-600 hover:underline">Edit</button>
                    <button onClick={() => remove(p)} className="text-rose-600 hover:underline">Delete</button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">{p.description || "No description"}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {p.members.map((m) => (
                  <span key={m._id} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{m.name}</span>
                ))}
              </div>
            </div>
          ))}
          {projects.length === 0 && <div className="text-slate-400">No projects yet.</div>}
        </div>
      )}

      <Modal
        open={open} onClose={() => setOpen(false)}
        title={editing ? "Edit project" : "New project"}
        footer={<>
          <button onClick={() => setOpen(false)} className="rounded-md border px-3 py-2 text-sm">Cancel</button>
          <button form="proj-form" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white">Save</button>
        </>}
      >
        <form id="proj-form" onSubmit={save} className="space-y-3">
          <label className="block text-sm">Title
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
          </label>
          <label className="block text-sm">Description
            <textarea rows="3" className="mt-1 w-full rounded-md border px-3 py-2" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          </label>
          {isAdmin && (
            <div className="text-sm">
              <div className="mb-1">Members</div>
              <div className="max-h-40 overflow-auto rounded-md border p-2">
                {users.map((u) => (
                  <label key={u._id} className="flex items-center gap-2 py-1">
                    <input type="checkbox" checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} />
                    <span>{u.name} <span className="text-slate-400">({u.email})</span></span>
                  </label>
                ))}
                {users.length === 0 && <div className="text-slate-400">No users.</div>}
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
