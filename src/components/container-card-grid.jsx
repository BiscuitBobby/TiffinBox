/* eslint-disable react/prop-types */

import { Activity, Box, Settings } from 'lucide-react';


function CircularProgress({ value, label, color }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          className="text-neutral-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
        <circle
          className={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold">{value}%</span>
        <span className="text-xs text-neutral-400">{label}</span>
      </div>
    </div>
  );
}

function ContainerCard({ container, onManage }) {
  return (
    <div className="group relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      {/* Container Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-50 blur group-hover:opacity-75 transition-opacity duration-300" />
            <div className="relative w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center">
              <Box className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              {container.NAME}
            </h3>
            <p className="text-xs font-mono text-neutral-500 mt-1">{container.ID}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          container.STATUS === 'running' 
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {container.STATUS}
        </div>
      </div>

      {/* Metrics */}
      <div className="flex justify-around mb-6">
        <CircularProgress 
          value={parseFloat(container.metrics.cpu)} 
          label="CPU %" 
          color="text-blue-500" 
        />
        <CircularProgress 
          value={parseFloat(container.metrics.memory)} 
          label="Memory %" 
          color="text-purple-500" 
        />
      </div>

      {/* Image Tag */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 px-3 py-2 bg-neutral-800/50 rounded-lg">
          <Activity className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-mono text-neutral-400">{container.IMAGE}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onManage}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <Settings className="w-4 h-4" />
        <span className="font-medium">Manage</span>
      </button>
    </div>
  );
}

export function ContainerCardGrid({ containers, onManageContainer }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {containers.map((container) => (
        <ContainerCard
          key={container.ID}
          container={container}
          onManage={() => onManageContainer(container.ID)}
        />
      ))}
    </div>
  );
}