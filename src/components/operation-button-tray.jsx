"use client"

import { Play, Square, Terminal } from "lucide-react"

export function OperationButtonTray({ containerID, status }) {
  const openTerminal = (id) => {
    console.log(id)
  }

  const startContainer = (id) => {
    console.log(id)
  }

  const stopContainer = (id) => {
    console.log(id)
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
        disabled={status !== "running"}
        onClick={() => stopContainer(containerID)}
      >
        <Square className="h-4 w-4" />
      </button>

      <button
        className="bg-transparent border border-white rounded-lg p-3 text-white hover:bg-white hover:text-green-300"
        onClick={() => openTerminal(containerID)}
      >
        <Terminal className="h-4 w-4" />
      </button>
    </div>
  )
}
