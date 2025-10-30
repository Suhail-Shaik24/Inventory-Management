import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Maker");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    if (storedUsers.find((u) => u.email === email)) {
      alert("User already exists!");
      return;
    }

    const newUser = { email, password, role };
    localStorage.setItem("users", JSON.stringify([...storedUsers, newUser]));
    alert("Signup successful! You can now login.");
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#864E25] outline-none"
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
            className="w-full bg-[#864E25] hover:bg-[#6f3f1d] text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Sign Up
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
