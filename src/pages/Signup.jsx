import { useState } from "react";
import axios from "axios";
import bg from "../assets/background.avif";
import TopBar from "../components/TopBar";
import { NavLink, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setMessage("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setMessage("Enter a valid email");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/api/auth/signup", null, {
        params: { username, email, password },
      });
      const data = response.data;
      setMessage(data.message);
      if (data.success) {
        console.log("Signup successful—redirect to login");
        navigate("/");
      }
    } catch (error) {
      setMessage("Signup failed: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-center bg-cover bg-brandDark" style={{ backgroundImage: `url(${bg})` }}>
      <div className="h-[60px]" />
      {/* Top Bar */}
      <div className="flex items-center justify-center w-full">
        <TopBar title="LOGO & Company name" showIcons={false} />
      </div>
      {/* Centered Signup Card */}
      <div className="flex items-center justify-center flex-1 w-full max-w-3xl bg-transparent">
        <div className="w-full max-w-lg bg-brandMaroon p-8 rounded-xl shadow-lg border border-brandBeige flex flex-col items-center mt-[-60px]">
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 text-black border rounded-md focus:ring-2 focus:ring-brandBeige"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-black border rounded-md focus:ring-2 focus:ring-brandBeige"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-black border rounded-md focus:ring-2 focus:ring-brandBeige"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 text-black border rounded-md focus:ring-2 focus:ring-brandBeige"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 font-semibold transition rounded-md bg-brandBeige text-brandDark hover:opacity-90"
            >
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
            {message && <p className="text-center text-white mt-2">{message}</p>}
            <div className="mt-2 space-y-1 text-xs text-center text-white">
              <div>
                Already have an account? <NavLink to="/" className="underline text-brandBeige">Login</NavLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}