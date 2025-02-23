import { useEffect, useState } from 'react';
import { Box, Plus, Loader2 } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { CreateContainerModal } from './create-container-modal';
import { useNavigate } from 'react-router-dom';
import { ContainerCardGrid } from './container-card-grid';

export default function ContainerManager() {
  const [containers, setContainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const [containerMetrics, setContainerMetrics] = useState({});

  const handleAddContainer = () => {
    setIsModalOpen(true);
  };
  
  const handleCreateContainer = async(containerData) => {
    const response = await invoke('create_container', { 
      container: containerData.name, 
      image: containerData.customImage 
    });
    if(response) {
      setIsModalOpen(false);
      navigate('/containers');
    }
  };

  const handleManageContainer = (containerId) => {
    navigate(`/container/${containerId}`);
  };

  const fetchMetrics = async () => {
    try {
      const metrics = await invoke('get_all_containers_status');
      const metricsMap = {};
      
      metrics.forEach(container => {
        if (container.status === 'success' && container.stats) {
          const cpuPercent = container.stats.CPUPerc || '0%';
          const memPercent = container.stats.MemPerc || '0%';
          
          metricsMap[container.id] = {
            cpu: parseFloat(cpuPercent.replace('%', '')),
            memory: parseFloat(memPercent.replace('%', ''))
          };
        }
      });
      
      setContainerMetrics(metricsMap);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchContainers = async () => {
      try {
        const response = await invoke('list_containers');
        
        if (response) {
          setContainers(response);
          await fetchMetrics();
        }
      } catch (error) {
        console.error('Error fetching containers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContainers();

    const metricsInterval = setInterval(fetchMetrics, 2000);

    return () => clearInterval(metricsInterval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-neutral-400">Loading containers...</p>
      </div>
    );
  }

  if (containers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Box className="w-16 h-16 text-neutral-600 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-3">No Containers Found</h2>
        <p className="text-neutral-400 text-center mb-8 max-w-md">
          It looks like you don&apos;t have any containers yet. Let&apos;s create one to get started!
        </p>
        <button
          onClick={handleAddContainer}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200 hover:shadow-lg"
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

      <ContainerCardGrid 
        containers={containers.map(container => ({
          ...container,
          metrics: containerMetrics[container.ID] || { cpu: 0, memory: 0 }
        }))}
        onManageContainer={handleManageContainer}
      />
    </div>
  );
}