import { CheckCircle as CircleCheck, KeyRound } from "lucide-react";
import { OperationButtonTray } from "./operation-button-tray";
import { useLocation } from "react-router-dom";
import { useRightSidebar } from "@/hooks/right-sidebar";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { DISTRO_ICONS } from '../utils/container-icons';
import { extractDistroName } from '../utils/container-utils';

export default function ContainerCard() {
  const location = useLocation();
  const distro = location.state;
  console.log('Distro:', distro);
  const [containerData, setContainerData] = useState(null);
  const [isPolling, setIsPolling] = useState(true);
  const { openRightSidebar } = useRightSidebar();
  const distroName = extractDistroName(distro.IMAGE);
  const distroIcon = DISTRO_ICONS[distroName];

  useEffect(() => {
    console.log("distro id here", distro.ID);

    // Function to fetch container data
    const fetchContainerData = async () => {
      try {
        const data = await invoke('get_container_status', { cid: distro.ID });
        console.log('Container data fetched:', data);
        if (data && Array.isArray(data) && data.length > 0) {
          // Get the first item from the array since we're only requesting one container
          const containerStats = data[0];
          console.log('Container stats:', containerStats);
          setContainerData(containerStats);
        } else {
          console.error('Error fetching container data or empty response');
        }
      } catch (error) {
        console.error('Error invoking backend function:', error);
        setIsPolling(false); // Stop polling on error
      }
    };

    // Initial fetch
    fetchContainerData();

    // Set up polling interval (every 2 seconds)
    const pollingInterval = setInterval(() => {
      if (isPolling) {
        fetchContainerData();
      }
    }, 2000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(pollingInterval);
    };
  }, [distro.ID, isPolling]);

  const handleOpenSidebar = () => {
    if (containerData) {
      openRightSidebar(containerData);
    } else {
      console.error("No container data available.");
    }
  };

  // Toggle polling function
  const togglePolling = () => {
    setIsPolling(prev => !prev);
  };

  return (
    <>
      <div className="w-full min-h-[20vh] rounded-xl border border-white bg-gradient-to-br from-neutral-800 to-neutral-900 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <img
                src='src/assets/icons/ubuntu.png'
                alt={distroName}
                className="relative w-[100px] h-[100px] md:w-[125px] md:h-[125px] lg:w-[150px] lg:h-[150px] rounded-full object-cover shadow-xl transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col items-center md:items-start flex-grow">
              <h2 className="text-2xl font-bold mb-4 text-center md:text-left bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {distro.NAME}
              </h2>
              <div className="w-full">
                <OperationButtonTray containerID={distro.ID} status={distro.STATUS} />
              </div>
            </div>
          </div>

          {/* Live Status Indicator */}
          {containerData && (
            <div className="mb-4 p-4 bg-neutral-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Live Stats</h3>
                <button
                  onClick={togglePolling}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    isPolling
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isPolling ? 'Polling On' : 'Polling Off'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-700 p-3 rounded-md">
                  <div className="text-sm text-gray-300">CPU Usage</div>
                  <div className="text-xl font-bold">{containerData.cpu_percent || containerData.avg_cpu || 'N/A'}</div>
                </div>
                <div className="bg-neutral-700 p-3 rounded-md">
                  <div className="text-sm text-gray-300">Memory Usage</div>
                  <div className="text-xl font-bold">{containerData.mem_usage || 'N/A'}</div>
                </div>
                <div className="bg-neutral-700 p-3 rounded-md">
                  <div className="text-sm text-gray-300">Network I/O</div>
                  <div className="text-xl font-bold">{containerData.net_io || 'N/A'}</div>
                </div>
                <div className="bg-neutral-700 p-3 rounded-md">
                  <div className="text-sm text-gray-300">Block I/O</div>
                  <div className="text-xl font-bold">{containerData.block_io || 'N/A'}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="bg-neutral-700 p-3 rounded-md">
                  <div className="text-sm text-gray-300">Memory %</div>
                  <div className="text-xl font-bold">{containerData.mem_percent || 'N/A'}</div>
                </div>
                <div className="bg-neutral-700 p-3 rounded-md">
                  <div className="text-sm text-gray-300">PIDs</div>
                  <div className="text-xl font-bold">{containerData.pids || 'N/A'}</div>
                </div>
                <div className="bg-neutral-700 p-3 rounded-md">
                  <div className="text-sm text-gray-300">CPU Time</div>
                  <div className="text-xl font-bold">{containerData.cpu_time || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Environment Tray */}
          <div className="pt-6 border-t border-neutral-700">
            <div className="flex flex-col sm:flex-row gap-4 justify-start w-full sm:w-auto">
              {/* Overview Button */}
{/*              <button
                className="flex items-center justify-center gap-3 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all duration-200 hover:shadow-lg group"
                onClick={handleOpenSidebar}
              >
                <CircleCheck className="w-5 h-5 text-emerald-500 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium">Overview</span>
              </button>
*/}
              {/* Keys Button */}
{/*              <button
                className="flex items-center justify-center gap-3 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-all duration-200 hover:shadow-lg group"
              >
                <KeyRound className="w-5 h-5 text-blue-500 transition-transform duration-200 group-hover:scale-110" />
                <span className="font-medium">Keys</span>
              </button>
*/}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}