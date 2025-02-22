import { useState } from "react";
import { X } from "lucide-react";

export function CreateContainerModal({ isOpen, onClose, onSubmit }) {
  const [containerData, setContainerData] = useState({
    name: "",
    image: "",
    ports: "",
    volumes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(containerData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Create New Container</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Container Name
            </label>
            <input
              type="text"
              value={containerData.name}
              onChange={(e) => setContainerData({ ...containerData, name: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Image
            </label>
            <input
              type="text"
              value={containerData.image}
              onChange={(e) => setContainerData({ ...containerData, image: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ports (optional)
            </label>
            <input
              type="text"
              value={containerData.ports}
              onChange={(e) => setContainerData({ ...containerData, ports: e.target.value })}
              placeholder="e.g., 8080:80"
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Volumes (optional)
            </label>
            <input
              type="text"
              value={containerData.volumes}
              onChange={(e) => setContainerData({ ...containerData, volumes: e.target.value })}
              placeholder="e.g., /host/path:/container/path"
              className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Create Container
          </button>
        </form>
      </div>
    </div>
  );
}
