import { DISTRO_ICONS } from './container-icons';
import archIcon from '../assets/icons/arch.svg';
import ubuntuIcon from '../assets/icons/ubuntu.png';

function parseImageString(imageString) {
  // Extract the base image name from various formats
  const parts = imageString.toLowerCase().split('/');
  const imageName = parts[parts.length - 1].split(':')[0];
  return imageName;
}

export function getContainerIcon(imageString) {
  // Always return ubuntu icon
  return ubuntuIcon;
}

export function enrichContainerData(container) {
  if (!container) return container;
  
  return {
    ...container,
    ICON: getContainerIcon(container.IMAGE),
    metrics: container.metrics || { cpu: 0, memory: 0 } // Ensure metrics exist
  };
}

export function extractDistroName(imageName) {
  // Always return ubuntu
  return 'ubuntu';
} 