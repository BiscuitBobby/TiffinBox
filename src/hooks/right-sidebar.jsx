/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
const SidebarContext = createContext(undefined);

export const useRightSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) { 
        throw new Error('useTerminal must be used within a TerminalProvider');
    }    
    return context
}

export const RightSidebarProvider = ({ children }) => {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [containerData, setContainerData] = useState(null);

    const openRightSidebar = (data) => {
        setContainerData(data);
        setIsRightSidebarOpen(true);
    };

    const closeRightSidebar = () => setIsRightSidebarOpen(false);

    return (
        <SidebarContext.Provider value={{ isRightSidebarOpen, openRightSidebar, closeRightSidebar, containerData }}>
        {children}
    </SidebarContext.Provider>
    )
}