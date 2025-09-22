export default function TopBar({ title = "", showIcons = true }) {
  return (
    <div className="w-full fixed top-0 left-0 right-0 bg-brandBeige/95 shadow-md">
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-3 rounded-t-lg">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <span className="text-base sm:text-lg font-bold truncate">{title}</span>
          {showIcons ? (
            <div className="flex items-center gap-3 sm:gap-4 text-lg sm:text-xl flex-shrink-0">
              <i className="fa fa-bell" />
              <i className="fa fa-user" />
              <i className="fa fa-th-large" />
            </div>
          ) : (
            <span className="text-lg sm:text-xl flex-shrink-0"><i className="fa fa-home" /></span>
          )}
        </div>
      </div>
    </div>
  );
}


