import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Modal from "../components/Modal";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Todo", "In Progress", "Done"];

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", project: "", assignedTo: "", status: "Todo", deadline: "" });

  const load = async () => {
    setLoading(true);
    const [t, p] = await Promise.all([api.get("/tasks"), api.get("/projects")]);
    setTasks(t.data); setProjects(p.data);
    setLoading(false);
  };
  useEffect(() => {
    load();
    if (isAdmin) api.get("/users").then(({data}) => setUsers(data)).catch(()=>{});
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title:"", description:"", project: projects[0]?._id || "", assignedTo:"", status:"Todo", deadline:"" });
    setOpen(true);
  };
  const openEdit = (t) => {
    setEditing(t);
    setForm({
      title: t.title, description: t.description || "",
      project: t.project?._id || "", assignedTo: t.assignedTo?._id || "",
      status: t.status, deadline: t.deadline ? t.deadline.slice(0,10) : "",
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, deadline: form.deadline || null, assignedTo: form.assignedTo || null };
      if (editing) await api.put(`/tasks/${editing._id}`, payload);
      else await api.post("/tasks", payload);
      toast.success("Saved");
      setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const remove = async (t) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    await api.delete(`/tasks/${t._id}`);
    toast.success("Deleted");
    load();
  };

  const updateStatus = async (t, status) => {
    try {
      await api.put(`/tasks/${t._id}`, { status });
      setTasks((cur) => cur.map((x) => x._id === t._id ? { ...x, status } : x));
      toast.success("Status updated");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        {isAdmin && <button onClick={openNew} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">+ New task</button>}
      </div>

      {loading ? <div className="text-slate-500">Loading…</div> : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Assignee</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const canChangeStatus = isAdmin || t.assignedTo?._id === user._id;
                return (
                  <tr key={t._id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.title}</div>
                      {t.description && <div className="text-xs text-slate-500">{t.description}</div>}
                    </td>
                    <td className="px-4 py-3">{t.project?.title || "—"}</td>
                    <td className="px-4 py-3">{t.assignedTo?.name || "Unassigned"}</td>
                    <td className="px-4 py-3">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      {canChangeStatus ? (
                        <select value={t.status} onChange={(e) => updateStatus(t, e.target.value)} className="rounded-md border px-2 py-1 text-xs">
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      ) : <StatusBadge status={t.status} />}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isAdmin && (
                        <div className="flex justify-end gap-2 text-sm">
                          <button onClick={() => openEdit(t)} className="text-indigo-600 hover:underline">Edit</button>
                          <button onClick={() => remove(t)} className="text-rose-600 hover:underline">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {tasks.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">No tasks.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open} onClose={() => setOpen(false)}
        title={editing ? "Edit task" : "New task"}
        footer={<>
          <button onClick={() => setOpen(false)} className="rounded-md border px-3 py-2 text-sm">Cancel</button>
          <button form="task-form" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white">Save</button>
        </>}
      >
        <form id="task-form" onSubmit={save} className="space-y-3">
          <label className="block text-sm">Title
            <input className="mt-1 w-full rounded-md border px-3 py-2" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
          </label>
          <label className="block text-sm">Description
            <textarea rows="2" className="mt-1 w-full rounded-md border px-3 py-2" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">Project
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.project} onChange={(e)=>setForm({...form,project:e.target.value})} required>
                <option value="">Select…</option>
                {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </label>
            <label className="block text-sm">Assignee
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.assignedTo} onChange={(e)=>setForm({...form,assignedTo:e.target.value})}>
                <option value="">Unassigned</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </label>
            <label className="block text-sm">Status
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="block text-sm">Deadline
              <input type="date" className="mt-1 w-full rounded-md border px-3 py-2" value={form.deadline} onChange={(e)=>setForm({...form,deadline:e.target.value})} />
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
