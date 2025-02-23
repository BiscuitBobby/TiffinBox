import { ChevronDown, ChevronUp, X } from "lucide-react";
import PropTypes from "prop-types";
import TerminalComponent from "./terminal";
import { useRef, useEffect } from "react";
import useTerminalStore from '../store/terminal-store';

export function TerminalPanel({ distroName }) {
  const { isTerminalOpen, toggleTerminal, closeTerminal, setTerminalRef } = useTerminalStore();
  const terminalInstanceRef = useRef(null);

  useEffect(() => {
    setTerminalRef(terminalInstanceRef);
  }, [setTerminalRef]);

  // Handle terminal resize when panel opens/closes
  useEffect(() => {
    if (isTerminalOpen && terminalInstanceRef.current) {
      setTimeout(() => {
        terminalInstanceRef.current.fitTerminal();
      }, 100);
    }
  }, [isTerminalOpen]);

  return (
    <div
      className={`bg-[rgb(29,41,61)] text-white border-t border-gray-700 transition-all duration-300 ease-in-out ${
        isTerminalOpen ? "h-1/2" : "h-10"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-10 bg-[rgb(29,41,61)]">
        <h3 className="font-semibold">Terminal {distroName ? `- ${distroName}` : ''}</h3>
        <div className="flex items-center space-x-2">
          <button 
            className="hover:bg-gray-700 p-1 rounded" 
            onClick={toggleTerminal}
          >
            {isTerminalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button 
            className="hover:bg-gray-700 p-1 rounded"
            onClick={closeTerminal}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className={`h-[calc(100%-40px)] w-full ${isTerminalOpen ? '' : 'hidden'}`}>
        <TerminalComponent ref={terminalInstanceRef} />
      </div>
    </div>
  );
}

TerminalPanel.propTypes = {
  distroName: PropTypes.string
};
