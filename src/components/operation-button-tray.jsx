"use client"

import { Play, Square, Terminal } from "lucide-react"
import useTerminalStore from '../store/terminal-store'

export function OperationButtonTray({ containerID, status }) {
  // Get store methods and terminal ref
  const { 
    isDistroActive, 
    activeDistroId, 
    setDistroState,
    safeExitDistro,
    toggleTerminal,
    terminalRef
  } = useTerminalStore()

  const startContainer = async (id) => {
    console.log('Start button clicked for container:', id)
    console.log('Current distro state:', { isDistroActive, activeDistroId })
    
    if (!isDistroActive) {
      console.log('No active distro, entering distro:', id)
      try {
        await terminalRef?.current?.writeToPty(`distrobox enter ${id}\n`)
        setDistroState(true, id)
        console.log('Successfully entered distro and updated state')
      } catch (error) {
        console.error('Error entering distro:', error)
      }
    } else if (activeDistroId !== id) {
      // If switching to a different distro
      console.log('Switching from distro', activeDistroId, 'to', id)
      try {
        // Safely exit current distro !!!!THIS IS VERY IMPORTANT AS IT WILL KILL THE APP IF NOT CHECKED
        await safeExitDistro()
        
        await terminalRef?.current?.writeToPty(`distrobox enter ${id}\n`)
        setDistroState(true, id)
        console.log('Successfully switched distro')
      } catch (error) {
        console.error('Error switching distro:', error)
      }
    } else {
      console.log('Distro already active, starting container:', id)
      try {
        await terminalRef?.current?.writeToPty(`distrobox enter ${id}\n`)
        console.log('Start command sent successfully')
      } catch (error) {
        console.error('Error starting container:', error)
      }
    }
  }

  const stopContainer = async (id) => {
    console.log('Stop button clicked for container:', id)
    try {
      // First safely exit if we're in the distro
      if (activeDistroId === id) {
        await safeExitDistro()
      }
      // Then send the distrobox stop command
      await terminalRef?.current?.writeToPty(`distrobox stop ${id}\n`)
      console.log('Stop commands sent successfully')
    } catch (error) {
      console.error('Error stopping container:', error)
    }
  }

  return (
    <div className="flex gap-2">
      <button 
        className="bg-transparent border border-white rounded-lg p-3 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={status === "running"}
        onClick={() => startContainer(containerID)}
      >
        <Play className="h-4 w-4" />
      </button>

      <button
        className="bg-transparent border border-white rounded-lg p-3 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => stopContainer(containerID)}
      >
        <Square className="h-4 w-4" />
      </button>

      <button
        className="bg-transparent border border-white rounded-lg p-3 text-white hover:bg-white hover:text-green-300"
        onClick={toggleTerminal}
      >
        <Terminal className="h-4 w-4" />
      </button>
    </div>
  )
}
