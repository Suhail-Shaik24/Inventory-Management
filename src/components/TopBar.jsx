import { NavLink } from "react-router-dom";

export default function TopBar({ title = "", showIcons = true }) {
  return (
    <div className="fixed top-0 left-0 right-0 w-full shadow-md bg-brandBeige/95">
      <div className="flex justify-around max-w-5xl px-4 py-3 mx-auto rounded-t-lg sm:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <span className="text-base font-bold truncate sm:text-lg">{title}</span>
          {showIcons ? (
            <div className="flex items-center flex-shrink-0 gap-3 text-lg sm:gap-4 sm:text-xl">
              <i className="fa fa-bell" />
              <i className="fa fa-user" />
              <i className="fa fa-th-large" />
            </div>
          ) : (
            <span className="flex-shrink-0 text-lg sm:text-xl"><i className="fa fa-home" /></span>
          )}
        </div>
        <div className="flex gap-2 buttons">
          <NavLink to="/profile"> <button> Profile </button></NavLink>
          <NavLink to="/"> <button> Logout </button></NavLink>      </div></div>
    </div>
  );
}


