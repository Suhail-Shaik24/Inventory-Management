import bg from "../assets/background.avif";
import TopBar from "../components/TopBar";

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-brandDark bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="h-[60px]" />
      {/* Top Bar */}
      <div className="w-full flex items-center justify-center">
        <TopBar title="LOGO & Company name" showIcons={false} />
      </div>
      {/* Centered Login Card */}
      <div className="w-full max-w-3xl flex flex-1 items-center justify-center bg-transparent">
        <div className="w-full max-w-lg bg-brandMaroon p-8 rounded-xl shadow-lg border border-brandBeige flex flex-col items-center mt-[-60px]">
          <form className="w-full space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded-md border focus:ring-2 focus:ring-brandBeige text-black"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-md border focus:ring-2 focus:ring-brandBeige text-black"
            />
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 bg-gray-200 rounded font-mono flex items-center gap-2 text-black">
                LTWn02q
                <i className="fa fa-refresh text-gray-500 cursor-pointer" />
              </div>
              <input
                type="text"
                placeholder="Enter Captcha"
                className="flex-1 p-3 rounded-md border focus:ring-2 focus:ring-brandBeige text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brandBeige text-brandDark font-semibold py-2 rounded-md hover:opacity-90 transition mt-2"
            >
              LOGIN
            </button>
            <div className="text-center text-xs text-white space-y-1 mt-2">
              <div>
                <a href="#" className="hover:underline">Forgot password</a>
                <span className="mx-1">|</span>
                <a href="#" className="hover:underline">Forgot username</a>
              </div>
              <div>
                New Here? <a href="#" className="underline text-brandBeige">Create an Account</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
