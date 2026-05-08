import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [loading, setLoading] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      toast.success("Account created");
      nav("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Create account</h1>
        {["name","email","password"].map((f) => (
          <label key={f} className="mb-3 block text-sm capitalize">
            {f}
            <input
              name={f}
              type={f === "password" ? "password" : f === "email" ? "email" : "text"}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
              value={form[f]} onChange={onChange} required
            />
          </label>
        ))}
        <label className="mb-5 block text-sm">
          Role
          <select name="role" value={form.role} onChange={onChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button disabled={loading} className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {loading ? "Creating…" : "Create account"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Have an account? <Link className="text-indigo-600 hover:underline" to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
