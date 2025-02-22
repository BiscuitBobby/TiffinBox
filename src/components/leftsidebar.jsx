import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import { CreateContainerModal } from "./create-container-modal";

export function LeftSidebar({ isCollapsed, onToggle }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddContainer = () => {
    setIsModalOpen(true);
  };

  const handleCreateContainer = (containerData) => {
    console.log("Creating container with data:", containerData);
  };

  return (
    <div className={`text-white transition-all duration-300 ease-in-out p-4 shadow-lg rounded-r-lg overflow-hidden flex flex-col gap-14`}>
      <div className={`bg-gray-800 p-4 rounded-xl duration-300 ease-in-out mb-6 ${isCollapsed ? "w-20" : "w-64"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isCollapsed ? "hidden" : "block"}`}>Containers</h2>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={handleAddContainer}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mb-4 flex items-center">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors" onClick={() => setIsSearchActive(!isSearchActive)}>
            <Search className="h-4 w-4" />
          </button>
          {!isCollapsed && isSearchActive && (
            <input
              type="text"
              placeholder="Search containers..."
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          )}
        </div>
        <div className="h-[calc(100vh-8rem)] overflow-y-auto">{/* Container list goes here */}</div>
      </div>
      
      {/* Distro Icons */}
      <div className="bg-gray-800 flex flex-col space-y-4 h-[calc(70vh)] rounded-xl overflow-y-auto w-20">
        <div className="space-y-4 flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {["Ubuntu", "Fedora", "Debian", "Arch", "Mint"].map((distro, index) => (
            <div key={index} className="relative group flex items-center justify-center space-x-2 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                <span>{distro.charAt(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <CreateContainerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateContainer} />
    </div>
  );
}
