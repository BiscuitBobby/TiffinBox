import { useTerminal } from "@/hooks/modal-context";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import PropTypes from "prop-types";
import TerminalComponent from "./terminal_test";

export function TerminalPanel({ distroName }) {
  TerminalPanel.propTypes = {
    distroName: PropTypes.string.isRequired,
  };
  const { isTerminalOpen, openTerminal, closeTerminal } = useTerminal();

  const toggleTerminal = () => {
    if (isTerminalOpen) {
      closeTerminal();
    } else {
      openTerminal();
    }
  };

  return (
    <div
      className={`bg-card text-card-foreground border-t border-border transition-all duration-300 ease-in-out ${isTerminalOpen ? "h-1/2" : "h-10"}`}
    >
      <div className="flex items-center justify-between px-4 h-10">
        <h3 className="font-semibold">Terminal</h3>
        <div>
          <button className="text-gray-300 hover:text-white focus:outline-none" size="icon" onClick={toggleTerminal}>
            {isTerminalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button className="text-gray-300 hover:text-white focus:outline-none" size="icon">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isTerminalOpen && (
        <div className="h-[calc(100%-2.5rem)] w-full">
          <TerminalComponent />
        </div>
      )}
    </div>
  );
}
