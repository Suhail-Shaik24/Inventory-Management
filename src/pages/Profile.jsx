import bg from "../assets/background.avif";
import TopBar from "../components/TopBar";
import { NavLink } from "react-router-dom";

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-center bg-cover bg-brandDark" style={{ backgroundImage: `url(${bg})` }}>
      <div className="h-[60px]" />
      {/* Top Bar */}
      <TopBar title="Profile Management" showIcons={false} />
      <NavLink to="/dashboard"><button className="p-4 py-2 text-black bg-blue-300 rounded-xl">Back</button></NavLink>
      {/* Profile Card */}
      <div className="flex items-center justify-center flex-1 w-full max-w-6xl px-4 bg-transparent sm:px-0">
        <div className="w-full bg-brandMaroon p-6 sm:p-8 rounded-b-xl shadow-lg border border-brandBeige flex flex-col md:flex-row gap-6 md:gap-8 items-start min-h-[520px] md:min-h-[560px]">
          {/* Avatar and labels */}
          <div className="flex flex-col items-center w-full gap-2 mt-2 md:w-auto">
            <div className="flex items-center justify-center w-16 h-16 mb-2 text-2xl text-gray-500 bg-gray-200 rounded-full sm:w-20 sm:h-20 sm:text-3xl">
              <i className="fa fa-user" />
            </div>
            <div className="flex flex-col gap-2 w-28">
              <span className="px-2 py-1 text-xs text-center bg-white rounded text-brandDark">Username</span>
              <span className="px-2 py-1 text-xs text-center bg-white rounded text-brandDark">Role</span>
            </div>
          </div>
          {/* Form fields */}
          <form className="flex flex-col flex-1 w-full gap-3 mt-2 text-white sm:gap-4">
            <input placeholder="FullName" className="w-full p-2 text-black border rounded" />
            <input placeholder="Contact Number" className="w-full p-2 text-black border rounded" />
            <input placeholder="Age" className="w-full p-2 text-black border rounded" />
            <input placeholder="Address" className="w-full p-2 text-black border rounded" />
            <input placeholder="Email" className="w-full p-2 text-black border rounded" />
            <input placeholder="Password" type="password" className="w-full p-2 text-black border rounded" />
            <div className="flex flex-wrap justify-start gap-3 mt-3 sm:gap-4 sm:mt-4">
              <button className="px-5 py-2 font-semibold rounded sm:px-6 bg-brandBeige text-brandDark hover:opacity-90">
                SAVE/UPDATE
              </button>
              <button className="px-5 py-2 bg-gray-500 rounded sm:px-6 hover:opacity-90">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
