import React from "react"
import { Command } from "cmdk"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} className="fixed inset-0 z-50 glass-morphism p-8">
      <Command.Input
        placeholder="Type a command or search..."
        className="w-full bg-card text-card-foreground p-2 rounded-md"
      />
      <Command.List className="mt-4">
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Containers">
          <Command.Item>Start all containers</Command.Item>
          <Command.Item>Stop all containers</Command.Item>
          <Command.Item>Restart all containers</Command.Item>
        </Command.Group>
        <Command.Group heading="Views">
          <Command.Item>Dashboard</Command.Item>
          <Command.Item>Container list</Command.Item>
          <Command.Item>Resource monitor</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}

