import { create } from 'zustand'

const useTerminalStore = create((set, get) => ({
  isTerminalOpen: false,
  isDistroActive: false,
  activeDistroId: null,
  terminalRef: null,
  
  setTerminalRef: (ref) => set({ terminalRef: ref }),
  toggleTerminal: () => {
    const state = get()
    set({ isTerminalOpen: !state.isTerminalOpen })
    // Ensure terminal fits after toggle
    if (!state.isTerminalOpen && state.terminalRef?.current) {
      setTimeout(() => {
        state.terminalRef.current.fitTerminal()
      }, 100)
    }
  },
  closeTerminal: () => set({ isTerminalOpen: false }),
  setDistroState: (isActive, distroId) => set({ 
    isDistroActive: isActive, 
    activeDistroId: distroId,
    isTerminalOpen: true // Auto-open terminal when distro becomes active
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