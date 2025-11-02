// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Maker");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitTo = async (path, payload) => api.post(path, payload);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Username, email and password are required.");
      return;
    }

    const payload = {
      username: username.trim(),
      email: email.trim(),
      password,
      role: role.toLowerCase(),
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

      // On success, go to login page
      alert("Signup successful! Please log in.");
      navigate("/login");
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
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#864E25] outline-none"
              placeholder="Choose a unique username"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#864E25] outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#864E25] outline-none"
              placeholder="Enter a strong password"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#864E25] outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Maker">Maker</option>
              <option value="Checker">Checker</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#864E25] hover:bg-[#6f3f1d] text-white py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#864E25] cursor-pointer hover:underline"
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
