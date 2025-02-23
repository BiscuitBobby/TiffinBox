import { useState } from 'react';
import { 
  Box, 
  CircleSlash, 
  Cpu, 
  Database, 
  HardDrive, 
  Network, 
  Plus, 
  Save, 
  Trash2, 
  X 
} from 'lucide-react';
import { useRightSidebar } from '@/hooks/right-sidebar';

export function RightSidebar() {
  const { isRightSidebarOpen, closeRightSidebar, containerData } = useRightSidebar();

  const [showEnvVars, setShowEnvVars] = useState(false);
  const [envVars, setEnvVars] = useState([
    { key: '', value: '' }
  ]);

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const removeEnvVar = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (index, field, value) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  // Helper function to safely parse percentage string
  const parsePercentage = (percentStr) => {
    if (!percentStr || typeof percentStr !== 'string') return 0;
    return parseFloat(percentStr.replace('%', '')) || 0;
  };


  if (!containerData) {
    return null;
  }

  // Safely parse the container metrics with default values
  const metrics = {
    cpu: parsePercentage(containerData[0]?.CPUPerc || '0%'),
    memPerc: parsePercentage(containerData[0]?.MemPerc || '0%'),
    memUsage: containerData[0]?.MemUsage || '0MB',
    memLimit: containerData[0]?.MemLimit || '0MB',
    netIO: containerData[0]?.NetIO || '0B / 0B',
    blockIO: containerData[0]?.BlockIO || '0B / 0B'
  };

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-96 bg-gradient-to-b from-neutral-900 to-neutral-800 transform transition-transform duration-300 ease-in-out ${
        isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } shadow-2xl`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-700">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Container Details
        </h2>
        <button
          onClick={closeRightSidebar}
          className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 h-[calc(100vh-80px)] overflow-y-auto">
        {/* Container Logo & Status */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 blur"></div>
            <div className="relative w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{containerData[0]?.Container || 'Unknown'}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${
                containerData[0]?.Status?.toLowerCase().includes('running') ? 'bg-emerald-400' : 'bg-red-400'
              }`}></span>
              <span className="text-sm text-neutral-300 capitalize">{containerData[0]?.Status || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Container ID */}
        <div className="flex items-center space-x-3 bg-neutral-800/50 p-4 rounded-lg">
          <Box className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm text-neutral-400">Container ID</p>
            <p className="font-mono text-sm">{containerData[0]?.ID || 'Unknown'}</p>
          </div>
        </div>

        {!showEnvVars ? (
          /* Metrics Display */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* CPU Usage */}
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-neutral-400">CPU</span>
                </div>
                <div className="flex items-end space-x-1">
                  <span className="text-2xl font-semibold">{metrics.cpu}</span>
                  <span className="text-sm text-neutral-400 mb-1">%</span>
                </div>
              </div>

              {/* Memory Usage */}
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-neutral-400">Memory</span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                      style={{ width: `${metrics.memPerc}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400">
                    <span>{metrics.memUsage}</span>
                    <span>{metrics.memLimit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network & Block I/O */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Network className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-neutral-400">Network I/O</span>
                </div>
                <p className="font-mono text-sm">{metrics.netIO}</p>
              </div>

              <div className="bg-neutral-800/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CircleSlash className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-neutral-400">Block I/O</span>
                </div>
                <p className="font-mono text-sm">{metrics.blockIO}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Environment Variables Form */
          <div className="space-y-4">
            <div className="space-y-4">
              {envVars.map((envVar, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={envVar.key}
                    onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                    placeholder="KEY"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <input
                    type="text"
                    value={envVar.value}
                    onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                    placeholder="VALUE"
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    onClick={() => removeEnvVar(index)}
                    className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={addEnvVar}
                className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Key</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-700 bg-neutral-900/50 backdrop-blur-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEnvVars(false)}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              !showEnvVars
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setShowEnvVars(true)}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              showEnvVars
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            Environment
          </button>
        </div>
      </div>
    </div>
  );
}