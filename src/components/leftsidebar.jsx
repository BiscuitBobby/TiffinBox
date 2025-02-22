import PropTypes from "prop-types";
import { useState } from "react";

function LeftSidebar({ isCollapsed, onToggle }) {
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Toggle search bar visibility
  const handleSearchToggle = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <div className="flex flex-col bg-gray-800 text-white p-4 h-full shadow-lg transition-all duration-300 ease-in-out">
      {/* Sidebar Main Section */}
      <div
        className={`flex flex-col bg-gray-700 p-4 rounded-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${isCollapsed ? "hidden" : ""}`}>
            Containers
          </h2>
          <button
            className="text-white text-xl focus:outline-none"
            onClick={onToggle}
          >
            {isCollapsed ? (
              <span>&gt;</span> // Collapse arrow
            ) : (
              <span>&lt;</span> // Expand arrow
            )}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            className="text-white text-xl focus:outline-none"
            onClick={onToggle}
          >
            🔍
          </button>
          {!isCollapsed && (
            <input
              type="text"
              placeholder="Search containers..."
              className="bg-gray-600 text-white p-2 rounded-md w-full"
            />
          )}
        </div>

        <button
          className="text-white text-xl focus:outline-none mb-4"
          onClick={handleSearchToggle}
        >
          {/* Optional Search Icon */}
        </button>

        <div className="overflow-y-auto flex-grow">
          {/* Container list goes here */}
        </div>
      </div>

      {/* Lower Part with Icons (Fixed and Scrollable) */}
      <div className="bg-gray-700 p-4 mt-4 rounded-lg overflow-y-auto flex-grow">
        <div className="flex flex-col gap-4">
          {["Ubuntu", "Fedora", "Debian", "Arch", "Mint"].map((distro, index) => (
            <div
              key={index}
              className="relative group flex items-center justify-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-all ease-in-out"
            >
              <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                <span>{distro.charAt(0)}</span>
              </div>
              <span className="absolute left-full ml-2 hidden group-hover:block bg-gray-600 text-white p-2 rounded-md shadow-md">
                {distro}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
LeftSidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default LeftSidebar;

