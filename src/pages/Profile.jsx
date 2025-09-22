import bg from "../assets/background.avif";
import TopBar from "../components/TopBar";

export default function Profile() {
  return (
    <div className="min-h-screen w-full bg-brandDark bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="h-[60px]" />
      {/* Top Bar */}
      <TopBar title="Profile Management" showIcons={false} />
      {/* Profile Card */}
      <div className="w-full max-w-6xl flex flex-1 items-center justify-center bg-transparent px-4 sm:px-0">
        <div className="w-full bg-brandMaroon p-6 sm:p-8 rounded-b-xl shadow-lg border border-brandBeige flex flex-col md:flex-row gap-6 md:gap-8 items-start min-h-[520px] md:min-h-[560px]">
          {/* Avatar and labels */}
          <div className="flex flex-col items-center gap-2 mt-2 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl sm:text-3xl text-gray-500 mb-2">
              <i className="fa fa-user" />
            </div>
            <div className="flex flex-col gap-2 w-28">
              <span className="bg-white text-brandDark text-xs rounded px-2 py-1 text-center">Username</span>
              <span className="bg-white text-brandDark text-xs rounded px-2 py-1 text-center">Role</span>
            </div>
          </div>
          {/* Form fields */}
          <form className="flex-1 flex flex-col gap-3 sm:gap-4 text-white mt-2 w-full">
            <input placeholder="FullName" className="p-2 rounded border w-full text-black" />
            <input placeholder="Contact Number" className="p-2 rounded border w-full text-black" />
            <input placeholder="Age" className="p-2 rounded border w-full text-black" />
            <input placeholder="Address" className="p-2 rounded border w-full text-black" />
            <input placeholder="Email" className="p-2 rounded border w-full text-black" />
            <input placeholder="Password" type="password" className="p-2 rounded border w-full text-black" />
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 sm:mt-4 justify-start">
              <button className="px-5 sm:px-6 py-2 bg-brandBeige text-brandDark font-semibold rounded hover:opacity-90">
                SAVE/UPDATE
              </button>
              <button className="px-5 sm:px-6 py-2 bg-gray-500 rounded hover:opacity-90">
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
