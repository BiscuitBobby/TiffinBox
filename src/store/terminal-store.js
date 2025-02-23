import { create } from 'zustand'

const useTerminalStore = create((set, get) => ({
  isTerminalOpen: false,
  isDistroActive: false,
  activeDistroId: null,
  terminalRef: null,
  
  setTerminalRef: (ref) => set({ terminalRef: ref }),
  toggleTerminal: () => set(state => ({ isTerminalOpen: !state.isTerminalOpen })),
  closeTerminal: () => set({ isTerminalOpen: false }),
  setDistroState: (isActive, distroId) => set({ 
    isDistroActive: isActive, 
    activeDistroId: distroId 
  }),
}))

export default useTerminalStore 