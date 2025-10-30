// import { useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
// import axios from "axios";
// import { Full_Logo } from "../assets";
// import { NavLink, useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";

// export default function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [captcha, setCaptcha] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [captchaValue, setCaptchaValue] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleCaptchaChange = (value) => {
//     setCaptchaValue(value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!captchaValue) {
//       alert("Please complete the reCAPTCHA!");
//       return;
//     }
//     console.log("Form submitted:", formData);
//   };


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setMessage("");

//   //   // Basic captcha check (static for now: "LTWn02q")
//   //   if (captcha !== "LTWn02q") {
//   //     setMessage("Invalid captcha");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.post("http://localhost:8081/api/auth/login", null, {
//   //       params: { username, password },
//   //     });
//   //     const data = response.data;
//   //     setMessage(data.message);
//   //     if (data.success) {
//   //       console.log("Login successful, role:", data.role);
//   //       localStorage.setItem('role', data.role);  // Store role for dashboard
//   //       navigate("/dashboard");  // Only redirect on success
//   //     }
//   //   } catch (error) {
//   //     setMessage("Login failed: " + (error.response?.data?.message || error.message));
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   return (
//     <div className="flex items-center justify-center w-full min-h-screen bg-loginImage">
//       <div className="bg-[rgba(33,19,9,0.9)] flex gap-8 justify-center text-white rounded-2xl p-12 py-6">
//         <div className="leftSide flex flex-col items-center justify-center  ">
//           <span>Welcome to</span>
//           <img src={Full_Logo} alt="Full_Logo" />
//         </div>
//         <div className="divider border border-r-2 opacity-70 rounded-full"></div>
//         <div className="rightSide flex flex-col gap-4 items-center justify-center ">

//           <h2 className="text-xl font-semibold text-center text-white">Login to your Account</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Username */}
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-white">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 className="w-full p-2 mt-1 border text-black bg-white border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-white">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full p-2 mt-1 text-black bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
//                 required
//               />
//             </div>

//             {/* reCAPTCHA */}
//             <div className="flex justify-center">
//               <ReCAPTCHA
//                 sitekey="YOUR_RECAPTCHA_SITE_KEY"
//                 onChange={handleCaptchaChange}
//               />
//             </div>

//             {/* Login Button */}
//             <NavLink to="/">
//               <button
//                 type="submit"
//                 className="w-full flex gap-2 items-center justify-center text-xl py-3 px-6 font-semibold text-white transition bg-[#864E25] rounded-lg hover:bg-blue-700"
//               >
//                 Login
//                 <ArrowRight />
//               </button>
//             </NavLink>

//             {/* Links */}
//             <div className="flex flex-col items-center pt-2 space-y-1 text-sm text-blue-600">
//               <div className="flex  gap-2 text-white">
//                 <button type="button" className="hover:underline">Forgot Username?</button>
//                 <button type="button" className="hover:underline">Forgot Password?</button>
//               </div>
//               <button type="button" className="hover:underline text-white">New here? Create Account</button>
//             </div>
//           </form>
//         </div>

//       </div>

//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Full_Logo } from "../assets";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      alert("Invalid credentials or account not found");
      return;
    }

    // Store current role in localStorage
    localStorage.setItem("role", foundUser.role);
    localStorage.setItem("userEmail", foundUser.email);

    // Redirect based on role
    switch (foundUser.role.toLowerCase()) {
      case "admin":
        navigate("/");
        break;
      case "maker":
        navigate("/DashboardMaker");
        break;
      case "checker":
        navigate("/DashboardChecker");
        break;
      default:
        alert("Unknown role");
    }
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-loginImage">
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
