import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Search,  ArrowLeftToLine } from "lucide-react";
import { CreateContainerModal } from "./create-container-modal";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { DISTRO_ICONS } from '../utils/container-icons';
import { extractDistroName } from '../utils/container-utils';

export default function LeftSidebar({ isCollapsed, onToggle }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [distros, setDistros] = useState([])
  const navigate = useNavigate();

  const handleCreateContainer = (containerData) => {
    console.log("Creating container with data:", containerData);
  };

  const handleBack = ()=>{
    navigate('/containers');
  }

 const  handleSearchButton = ()=>{
  if(!isModalOpen){
    onToggle();
    setIsSearchActive(!isSearchActive);}
    else{
      setIsSearchActive(!isSearchActive);
    }
  }
  

  const handleContainerCard = (distro) =>{
    return ()=>{
      console.log('Selected container:',distro);
      navigate('/container',{state:distro});
    }
  }

  useEffect(() => {
   
   const containers = async() =>{
    try {
        const response = await invoke('list_containers');
        if(response){
            console.log('Containers:',response);
            setDistros(response);
           
        }
        else{
            console.log('No containers found');
           
        }

    } catch (error) {
        console.log('Error fetching containers:',error);
    }
   }
   containers();
  }, []);

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
          <button className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-700/50
              rounded-lg transition-all duration-200 flex items-center justify-center" onClick={handleBack}>

          <ArrowLeftToLine />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-zinc-400 hover:text-orange-400 hover:bg-zinc-700/50
              rounded-lg transition-all duration-200 flex items-center justify-center "
            onClick={handleSearchButton}
          >
            <Search className="h-6 w-5" />
            
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
            {distros.map((distro) => {
              const distroName = extractDistroName(distro.IMAGE);
              const distroIcon = DISTRO_ICONS[distroName];
              console.log('Distro icon for', distroName, ':', distroIcon);
              
              return (
                <div
                  key={distro.ID}
                  className="group relative w-full flex justify-center"
                >
                  <div className={`
                    w-12 h-12
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
                    <button className="pointer" onClick={handleContainerCard(distro)}>
                      <img 
                        src='src/assets/icons/ubuntu.png'
                        alt={distroName} 
                        className="w-10 h-10 rounded-full shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
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