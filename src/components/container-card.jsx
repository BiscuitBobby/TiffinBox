"use client"

import { Play, Square, RefreshCw, Terminal, CircleCheck, KeyRound, Cog } from "lucide-react"
import { OperationButtonTray } from "./operation-button-tray"

export default function ContainerCard({ name, icon, status }) {
  return (
    <div className="w-full h-full rounded-lg border bg-neutral-800 text-white shadow-sm">
      <div className="p-6">
        <div className="grid grid-cols-3 items-center justify-center py-10 lg:w-1/2 w-full">
          <img 
            src={icon} 
            alt={name} 
            className="mx-auto my-auto shadow-2xl rounded-full w-[100px] h-[100px] md:w-[125px] md:h-[125px] lg:w-[150px] lg:h-[150px] object-cover"
          />
          <div className="flex flex-col justify-left col-span-2 w-1/2">
            <h2 className="text-lg font-medium pl-2">{name}</h2>
            <OperationButtonTray containerID={name} status={status} />  
          </div>
        </div>
        <div className="flex flex-row items-center justify-between pt-5 border-t border-white">
          <div className="flex flex-row items-center justify-evenly w-1/4">
            <button id="overview" className="bg-zinc-900 text-white w-full mx-2 px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md">
              <CircleCheck className="text-green-500" />
              <span>Overview</span>
            </button>
            <button id="keys" className="bg-zinc-900 text-white w-full mx-2 px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md">
              <KeyRound className="text-blue-500" />
              <span>Keys</span>
            </button>
            <button id="settings" className="bg-zinc-900 text-white w-full mx-2 px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-md">
              <Cog className="text-yellow-500" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
