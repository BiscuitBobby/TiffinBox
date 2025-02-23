import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Check, Box, Terminal, ChevronDown } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

export function CreateContainerModal({ isOpen, onClose, onSubmit }) {
  const [containerData, setContainerData] = useState({
    name: '',
    selectedImage: 'ubuntu',
    customImage: '',
    root: false,
    flags: {
      restart: false,
      privileged: false,
      interactive: false,
      detach: false,
    }
  });

  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [isCustomImageDropdownOpen, setIsCustomImageDropdownOpen] = useState(false);
  const imageDropdownRef = useRef(null);
  const customImageDropdownRef = useRef(null);
  const [predefinedImages, setPredefinedImages] = useState([]);



  useEffect(() => {
    const predefinedImages = async () => {
      try {
        const response = await invoke('distro_images');
        if (response) {
          console.log('Images:', response);
          const mappedImages = Object.entries(response.Base_Images).map(([distro, data]) => {
            return {
              value: distro.toLowerCase().replace(/\s+/g, '-'), 
              label: distro, 
              versions: data.images.map(image => ({
                value: image,  
                label: image.split(':')[1] || image 
              }))
            };
          });
  
          setPredefinedImages(mappedImages);
        } else {
          console.log('No images found');
        }
      } catch (error) {
        console.log('Error fetching images:', error);
      }
    };
    predefinedImages();
  }, []);
  
  
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imageDropdownRef.current && !imageDropdownRef.current.contains(event.target)) {
        setIsImageDropdownOpen(false);
      }
      if (customImageDropdownRef.current && !customImageDropdownRef.current.contains(event.target)) {
        setIsCustomImageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...containerData,
      image: containerData.selectedImage === 'custom' 
        ? containerData.customImage 
        : containerData.selectedImage,
    };
    onSubmit(finalData);
    onClose();
  };

  const selectedImage = predefinedImages.find(img => img.value === containerData.selectedImage);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-4xl shadow-2xl border border-zinc-800/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-zinc-100">Create Container</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex divide-x divide-zinc-800/50">
            {/* Left Section */}
            <div className="w-1/2 p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Container Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={containerData.name}
                      onChange={(e) => setContainerData({ ...containerData, name: e.target.value })}
                      className="w-full bg-zinc-800/50 text-zinc-100 rounded-xl pl-10 pr-4 py-3
                        focus:outline-none focus:ring-2 focus:ring-orange-500/50
                        border border-zinc-700/50"
                      placeholder="my-container"
                    />
                    <Terminal className="absolute left-3 top-3.5 w-4 h-4 text-zinc-500" />
                  </div>
                </div>

                <div>
  <label className="block text-sm font-medium text-zinc-300 mb-2">
    Base Image
  </label>
  <div className="relative" ref={imageDropdownRef}>
    <button
      type="button"
      onClick={() => setIsImageDropdownOpen(!isImageDropdownOpen)}
      className="w-full bg-zinc-800/50 text-zinc-100 rounded-xl px-4 py-3
        focus:outline-none focus:ring-2 focus:ring-orange-500/50
        border border-zinc-700/50 flex items-center justify-between
        hover:bg-zinc-700/50 transition-colors"
    >
      <span>{selectedImage?.label || 'Select image'}</span>
      <ChevronDown className={`w-4 h-4 transition-transform ${isImageDropdownOpen ? 'rotate-180' : ''}`} />
    </button>
    
    {isImageDropdownOpen && (
      <ul className="absolute z-10 w-full mt-2 overflow-auto rounded-xl border border-zinc-700/50
        bg-zinc-800 shadow-lg max-h-[280px]">
        {/* Custom Option */}
        <li
          className="cursor-pointer text-zinc-100 flex w-full text-sm items-center p-3
            transition-colors hover:bg-zinc-700/50 border-b border-zinc-700/50 last:border-0"
          onClick={() => {
            setContainerData({ ...containerData, selectedImage: 'custom' });
            setIsImageDropdownOpen(false);
          }}
        >
          <div className="flex flex-col">
            <span>Custom</span>
            <span className="text-xs text-zinc-400">Enter your custom image name or URL</span>
          </div>
        </li>

        {/* Predefined Images */}
        {predefinedImages.map((imageGroup) => (
          <li
            key={imageGroup.value}
            className="cursor-pointer text-zinc-100 flex w-full text-sm items-center p-3
              transition-colors hover:bg-zinc-700/50 border-b border-zinc-700/50 last:border-0"
            onClick={() => {
              setContainerData({ ...containerData, selectedImage: imageGroup.value });
              setIsImageDropdownOpen(false);
            }}
          >
            <div className="flex flex-col">
              <span>{imageGroup.label}</span>
              <span className="text-xs text-zinc-400">{imageGroup.versions.length} versions</span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>


                {containerData.selectedImage !== 'custom' && selectedImage?.versions && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Image Version
                    </label>
                    <div className="relative" ref={customImageDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsCustomImageDropdownOpen(!isCustomImageDropdownOpen)}
                        className="w-full bg-zinc-800/50 text-zinc-100 rounded-xl px-4 py-3
                          focus:outline-none focus:ring-2 focus:ring-orange-500/50
                          border border-zinc-700/50 flex items-center justify-between
                          hover:bg-zinc-700/50 transition-colors"
                      >
                        <span>{containerData.customImage || `Select ${selectedImage.label} version`}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isCustomImageDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isCustomImageDropdownOpen && (
                        <ul className="absolute z-10 w-full mt-2 overflow-auto rounded-xl border border-zinc-700/50
                          bg-zinc-800 shadow-lg">
                          {selectedImage.versions.map((version) => (
                            <li
                              key={version.value}
                              className="cursor-pointer text-zinc-100 flex w-full text-sm items-center p-3
                                transition-colors hover:bg-zinc-700/50 border-b border-zinc-700/50 last:border-0"
                              onClick={() => {
                                setContainerData({ ...containerData, customImage: version.value });
                                setIsCustomImageDropdownOpen(false);
                              }}
                            >
                              {version.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

{containerData.selectedImage === 'custom' && (
  <div>
    <label className="block text-sm font-medium text-zinc-300 mb-2">
      Custom Image
    </label>
    <input
      type="text"
      value={containerData.customImage}
      onChange={(e) => setContainerData({ ...containerData, customImage: e.target.value })}
      className="w-full bg-zinc-800/50 text-zinc-100 rounded-xl px-4 py-3
        focus:outline-none focus:ring-2 focus:ring-orange-500/50
        border border-zinc-700/50"
      placeholder="Enter custom image name or URL"
    />
  </div>
)}

              </div>
            </div>

            {/* Right Section */}
            <div className="w-1/2 p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl">
                  <div>
                    <label className="text-sm font-medium text-zinc-300">Root Access</label>
                    <p className="text-xs text-zinc-500 mt-1">Enable root privileges for this container</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContainerData({ ...containerData, root: !containerData.root })}
                    className={`
                      relative inline-flex h-7 w-12 items-center rounded-full
                      transition-colors duration-200 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-orange-500/50
                      ${containerData.root ? 'bg-orange-500' : 'bg-zinc-700'}
                    `}
                  >
                    <span className="sr-only">Toggle root access</span>
                    <span
                      className={`
                        inline-block h-5 w-5 transform rounded-full bg-white shadow-lg
                        transition duration-200 ease-in-out
                        ${containerData.root ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-zinc-300">
                    Container Flags
                  </label>
                  <div className="space-y-2 bg-zinc-800/30 rounded-xl p-2">
                    {Object.entries({
                      restart: 'Always restart',
                      privileged: 'Privileged mode',
                      interactive: 'Interactive (-it)',
                      detach: 'Detached mode (-d)'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 p-2 rounded-lg
                        hover:bg-zinc-700/50 transition-colors cursor-pointer">
                        <div
                          className={`
                            w-5 h-5 rounded-md flex items-center justify-center
                            transition-colors duration-200
                            ${containerData.flags[key] 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-zinc-700 text-transparent'}
                            border border-zinc-600
                          `}
                          onClick={() => setContainerData({
                            ...containerData,
                            flags: {
                              ...containerData.flags,
                              [key]: !containerData.flags[key]
                            }
                          })}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-sm text-zinc-300">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-zinc-800/50 bg-zinc-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-300 hover:bg-zinc-800/50
                transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-xl
                hover:bg-orange-600 transition-colors duration-200
                flex items-center gap-2"
            >
              <span>Create Container</span>
              <Box className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CreateContainerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};