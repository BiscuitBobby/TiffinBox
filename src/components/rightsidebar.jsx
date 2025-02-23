import PropTypes from 'prop-types';
import { ChevronLeft, Search } from 'lucide-react';

export function RightSidebar({ isCollapsed, onToggle }) {
  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-0 py-4" : "w-64 p-4"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${isCollapsed ? "hidden" : "block"}`}>
          Containers
        </h2>
        <button
          onClick={onToggle}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {!isCollapsed && <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      {!isCollapsed && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search containers..."
              className="w-full bg-gray-600 text-white p-2 rounded-md pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
        </div>
      )}
      <div className="overflow-y-auto h-[calc(100vh-8rem)]">
        {/* Container list goes here */}
      </div>
    </div>
  );
}

RightSidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
