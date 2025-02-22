import { useState } from "react";
import PropTypes from 'prop-types';
import { Search, Plus } from "lucide-react";
import { CreateContainerModal } from "./create-container-modal";

export default function LeftSidebar({ isCollapsed, onToggle }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddContainer = () => {
    setIsModalOpen(true);
  };

  const handleCreateContainer = (containerData) => {
    console.log("Creating container with data:", containerData);
  };

 const  handleSearchButton = ()=>{
  if(!isModalOpen){
    onToggle();
    setIsSearchActive(!isSearchActive);}
    else{
      setIsSearchActive(!isSearchActive);
    }
  }
  const distros = [
    { name: "Ubuntu", color: "bg-orange-500" },
    { name: "Fedora", color: "bg-blue-500" },
    { name: "Debian", color: "bg-red-500" },
    { name: "Arch", color: "bg-cyan-500" },
    { name: "Mint", color: "bg-green-500" }
  ];

  return (
    <div className={`
      flex flex-col h-screen
      border-r border-zinc-800/50
      bg-zinc-900/50
      backdrop-blur-xl
      transition-all duration-300 ease-out
      p-4
      gap-4
    `}>
      {/* Upper Section */}
      <div className={`
        bg-zinc-800/50
        rounded-xl p-4
        ${isCollapsed ? "w-20" : "w-72"}
        transition-all duration-300 ease-out
      `}>
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-zinc-100">Containers</h2>
          )}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddContainer}
              className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-700/50
                rounded-lg transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
            </button>
           
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-700/50
              rounded-lg transition-all duration-200 flex items-center justify-center "
            onClick={handleSearchButton}
          >
            <Search className="h-5 w-5" />
            
          </button>
          {!isCollapsed && (
            <input
              type="text"
              placeholder="Search containers..."
              className="w-full bg-zinc-800/50 text-zinc-100 rounded-xl px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-orange-500/50
                border border-zinc-700/50
                placeholder-zinc-500"
            />
          )}
        </div>
      </div>

      {/* Distro Icons Section */}
      <div className="
        flex-1
        bg-zinc-800/50
        rounded-xl
        overflow-hidden
        w-20
      ">
        <div className="
          h-full
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent
          px-2 py-4
        ">
          <div className="flex flex-col items-center space-y-4">
            {distros.map((distro, index) => (
              <div
                key={index}
                className="group relative w-full flex justify-center"
              >
                <div className={`
                  w-12 h-12
                  ${distro.color}
                  bg-opacity-85
                  rounded-xl
                  flex items-center justify-center
                  text-white font-medium text-lg
                  shadow-lg shadow-black/10
                  hover:scale-105
                  hover:shadow-xl
                  hover:shadow-black/20
                  transition-all duration-200
                  cursor-pointer
                  ring-1 ring-white/10
                  hover:ring-white/20
                `}>
                  {distro.name[0]}
                </div>

                {/* Hover tooltip */}
                <div className="
                  absolute left-full ml-2 z-50
                  hidden group-hover:block
                  bg-zinc-800/95
                  backdrop-blur-sm
                  text-zinc-100
                  px-3 py-2 rounded-lg
                  whitespace-nowrap
                  shadow-xl shadow-black/20
                  text-sm
                  border border-zinc-700/50
                  transform
                  transition-all duration-200
                ">
                  {distro.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <CreateContainerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateContainer} 
      />
    </div>
  );
}

LeftSidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};