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
  // Add helper method to safely exit distro
  safeExitDistro: async () => {
    const state = get()
    if (state.isDistroActive && state.terminalRef?.current) {
      await state.terminalRef.current.writeToPty('exit\n')
      set({ isDistroActive: false, activeDistroId: null })
    }
  }
}))

export default useTerminalStore 