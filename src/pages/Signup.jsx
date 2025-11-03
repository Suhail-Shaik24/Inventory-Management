// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Maker");
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();

  const submitTo = async (path, payload) => api.post(path, payload);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Username, email and password are required.");
      return;
    }

    // Map UI role to backend expected values
    const roleUpper = role.toUpperCase();
    const backendRole = roleUpper === 'ADMIN' ? 'MANAGER' : roleUpper; // legacy guard

    const payload = {
      username: username.trim(),
      email: email.trim(),
      password,
      role: backendRole, // send UPPERCASE so DB stores MANAGER/MAKER/CHECKER
    };

    try {
      setLoading(true);
      let res;
      try {
        res = await submitTo("/api/auth/signup", payload);
      } catch (err) {
        if (err?.response?.status === 404) {
          res = await submitTo("/api/auth/token/signup", payload);
        } else {
          throw err;
        }
      }
      // On success, open success modal; navigation from the modal button
      setSuccessOpen(true);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        alert("User already exists with this username/email.");
      } else if (status === 400) {
        alert(err?.response?.data?.message || "Invalid signup data.");
      } else if (!status) {
        alert("Cannot reach backend. Ensure server is running on http://localhost:8081 and CORS is configured.");
      } else {
        const msg = err?.response?.data?.message || err.message || "Signup failed";
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-loginImage">
      {/* Success Modal */}
      <ConfirmModal
        open={successOpen}
        title="Signup successful"
        message="Signup successful! Please proceed to the login page."
        confirmText="Go to Login"
        cancelText="Close"
        onConfirm={() => {
          setSuccessOpen(false);
          navigate("/login", { replace: true });
        }}
        onCancel={() => setSuccessOpen(false)}
      />
      <div className="w-full max-w-md rounded-2xl bg-[#29190D]/80 p-8 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white">Create your account</h2>
          <p className="mt-1 text-sm text-white/70">Join the inventory platform and start managing stock.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
              placeholder="Choose a unique username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
              placeholder="Enter a strong password"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-white/80">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
            >
              <option className="bg-[#29190D]" value="Manager">Manager</option>
              <option className="bg-[#29190D]" value="Maker">Maker</option>
              <option className="bg-[#29190D]" value="Checker">Checker</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-600 py-2 font-semibold text-black transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="mt-3 text-center text-sm text-white/80">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")} className="text-amber-400 hover:underline">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
