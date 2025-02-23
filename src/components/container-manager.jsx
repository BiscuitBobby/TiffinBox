import { useEffect, useState } from 'react';
import { Box, Plus, Loader2, Settings } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { CreateContainerModal } from './create-container-modal';
import { useNavigate } from 'react-router-dom';



export default function ContainerManager() {
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const naviagte = useNavigate();
  
  const handleAddContainer = () => {
    console.log('Add container clicked!!');
    console.log(isModalOpen);
    setIsModalOpen(true);
  };
  

  const handleCreateContainer = async(containerData) => {

   const response = await invoke('create_container', { container: containerData.name, image: containerData.customImage });
   if(response){
     console.log('Container created:',response);
      setIsModalOpen(false);
      naviagte('/containers');}
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchContainers = async () => {
      try {
        const response = await invoke('list_containers');
        if (response) {
          setContainers(response);
        } else {
          console.log('No containers found');
        }
      } catch (error) {
        console.error('Error fetching containers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContainers();
  }, []);



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading containers...</p>
      </div>
    );
  }

  if (containers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Box className="w-16 h-16 text-gray-600 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-3">No Containers Found</h2>
        <p className="text-gray-400 text-center mb-8 max-w-md">
          It looks like you don&apos;t have any containers yet. Let&apos;s create one to get started!
        </p>
        <button
          onClick={handleAddContainer}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Container</span>
        </button>
        <CreateContainerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleCreateContainer} 
        />

      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto overflow-x-hidden">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Your Containers</h1>
        <button
          onClick={handleAddContainer}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Container</span>
          
        </button>
        <CreateContainerModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateContainer}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map((container) => (
          <div
            key={container.ID}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:bg-gray-750 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
               <div className="flex items-center space-x-3">
                
                  <img 
                    src={container.ICON}
                    alt={`${container.NAME} icon`}
                    className="w-8 h-8 rounded"
                  
                  />
                
                <div>
                  <h3 className="text-lg font-semibold text-white">{container.NAME}</h3>
                  <p className="text-sm text-gray-400">{container.STATUS}</p>
                </div>
              </div> 
              <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                {container.IMAGE}
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <button
                className="flex items-center justify-center space-x-2 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Manage</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
 }

