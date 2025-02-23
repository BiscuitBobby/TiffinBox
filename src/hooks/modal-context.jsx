"use client"
import { createContext, useContext, useState } from "react";
import PropTypes from 'prop-types';
// interface TerminalContextType {
//     isTerminalOpen: boolean;
//     openTerminal: () => void;
//     closeTerminal: () => void;
// }

const ModalContext = createContext(undefined);

export const useTerminal = () => {
    const context = useContext(ModalContext);
    if (!context) { 
        throw new Error('useTerminal must be used within a TerminalProvider');
    }
    
    TerminalProvider.propTypes = {
        children: PropTypes.node.isRequired,
    };
    
    return context
}

export const TerminalProvider = ({ children }) => {
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const openTerminal = () => setIsTerminalOpen(true);
    const closeTerminal = () => setIsTerminalOpen(false);

    return (
        <ModalContext.Provider value={{ isTerminalOpen, openTerminal, closeTerminal }}>
            {children}
        </ModalContext.Provider >
    )
}