import { Cpu, HardDrive, MemoryStickIcon as Memory } from "lucide-react"

export function StatusBar() {
  return (
    <div className="bg-card text-card-foreground border-t border-border h-10 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <Cpu className="h-4 w-4 mr-2" />
          CPU: 25%
        </span>
        <span className="flex items-center">
          <Memory className="h-4 w-4 mr-2" />
          RAM: 4.2GB / 16GB
        </span>
        <span className="flex items-center">
          <HardDrive className="h-4 w-4 mr-2" />
          Disk: 120GB / 512GB
        </span>
      </div>
      <div>5 containers running</div>
    </div>
  )
}

