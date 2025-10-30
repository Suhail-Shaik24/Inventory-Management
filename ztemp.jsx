<div className="flex flex-col items-center justify-center w-full min-h-screen bg-loginImage">
    <div className="h-[60px]" />
    {/* Centered Login Card */}
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
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 text-black border rounded-md focus:ring-2 focus:ring-brandBeige"
                    required
                />
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 font-mono text-black bg-gray-200 rounded">
                        LTWn02q
                        <i className="text-gray-500 cursor-pointer fa fa-refresh" />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter Captcha"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        className="flex-1 p-3 text-black border rounded-md focus:ring-2 focus:ring-brandBeige"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 mt-2 font-semibold transition rounded-md bg-brandBeige text-brandDark hover:opacity-90"
                >
                    {loading ? "Logging in..." : "LOGIN"}
                </button>
                {message && <p className="mt-2 text-center text-white">{message}</p>}
                <div className="mt-2 space-y-1 text-xs text-center text-white">
                    <div>
                        <a href="#" className="hover:underline">Forgot password</a>
                        <span className="mx-1">|</span>
                        <a href="#" className="hover:underline">Forgot username</a>
                    </div>
                    <div>
                        New Here? <NavLink to="/signup" className="underline text-brandBeige">Create an Account</NavLink>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>