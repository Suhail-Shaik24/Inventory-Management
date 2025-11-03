import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Full_Logo } from "../assets";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { login, user, logout } = useAuth();

  // Back-button protection: if user is already authenticated and reaches /login,
  // ask for confirmation to logout; if cancelled, send back to their dashboard.
  useEffect(() => {
    if (!user) return;
    setShowConfirm(true);

    // Prevent navigating back to previous dashboard entries while modal is open
    const url = window.location.href;
    window.history.pushState({ guard: 'login' }, '', url);
    const onPopState = () => {
      window.history.pushState({ guard: 'login' }, '', url);
      setShowConfirm(true);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToRole = (role) => {
    const r = String(role || "").toLowerCase();
    if (r === "maker") navigate("/DashboardMaker", { replace: true });
    else if (r === "checker") navigate("/DashboardChecker", { replace: true });
    else navigate("/manager-dashboard", { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Backend expects username + password; we will treat email as username
      const data = await login(email, password);

      // Navigate by role from response
      const role = (data?.user?.role || "").toLowerCase();
      switch (role) {
        case "maker":
          navigate("/DashboardMaker", { replace: true });
          break;
        case "checker":
          navigate("/DashboardChecker", { replace: true });
          break;
        case "admin":
        case "manager":
          navigate("/manager-dashboard", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }
    } catch (err) {
      const msg = err?.response?.status === 401 ? "Invalid credentials" : (err?.response?.data?.message || err.message || "Login failed");
      alert(msg);
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-loginImage">
      {/* Confirm modal for back-protection when already authenticated */}
      <ConfirmModal
        open={showConfirm}
        title="Leave Dashboard?"
        message="Are you sure you want to log out and go back to the login page?"
        confirmText="Log Out"
        cancelText="Stay"
        onConfirm={() => { setShowConfirm(false); logout(); }}
        onCancel={() => { setShowConfirm(false); navigateToRole(user?.role); }}
      />

      <div className="bg-[rgba(33,19,9,0.9)] flex gap-8 justify-center text-white rounded-2xl p-12 py-6">
        {/* Left Side */}
        <div className="leftSide flex flex-col items-center justify-center">
          <span className="text-lg mb-2 opacity-90">Welcome to</span>
          <img src={Full_Logo} alt="Full_Logo" className="w-40" />
        </div>

        <div className="divider border border-r-2 opacity-70 rounded-full"></div>

        {/* Right Side */}
        <div className="rightSide flex flex-col gap-4 items-center justify-center">
          <h2 className="text-xl font-semibold text-center text-white">
            Login to your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-4 w-72">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 mt-1 border text-black bg-white border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 mt-1 text-black bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full flex gap-2 items-center justify-center text-xl py-3 px-6 font-semibold text-white transition bg-[#864E25] rounded-lg hover:bg-blue-700"
            >
              Login
              <ArrowRight />
            </button>

            {/* Links */}
            <div className="flex flex-col items-center pt-2 space-y-1 text-sm text-white">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="hover:underline text-white"
                  onClick={() => alert("Forgot Username feature coming soon!")}
                >
                  Forgot Username?
                </button>
                <button
                  type="button"
                  className="hover:underline text-white"
                  onClick={() => alert("Forgot Password feature coming soon!")}
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="button"
                className="hover:underline text-white"
                onClick={() => navigate("/signup")}
              >
                New here? Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
