import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("maker");
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();

        // Fetch existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Check if email already exists
        if (existingUsers.some((user) => user.email === email)) {
            alert("Email already registered. Please log in.");
            return;
        }

        // Create new user
        const newUser = { email, password, role };
        const updatedUsers = [...existingUsers, newUser];

        // Store updated user list
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        alert("Signup successful! You can now log in.");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a120b]">
            <div className="bg-[#2a1a0d] p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-white text-center mb-6">
                    Create Account
                </h2>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            className="mt-1 w-full rounded-md bg-[#3a2615] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            className="mt-1 w-full rounded-md bg-[#3a2615] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Role
                        </label>
                        <select
                            className="mt-1 w-full rounded-md bg-[#3a2615] text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="manager">Manager</option>
                            <option value="maker">Maker</option>
                            <option value="checker">Checker</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#864E25] hover:bg-amber-600 text-white font-medium py-2 rounded-lg transition-all"
                    >
                        Sign Up
                    </button>

                    <p className="text-center text-gray-400 text-sm mt-3">
                        Already have an account?{" "}
                        <span
                            className="text-amber-500 hover:underline cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Log in
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
