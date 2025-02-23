import { useTerminal } from "@/hooks/modal-context";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import PropTypes from "prop-types";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

export function TerminalPanel({ distroName }) {
  TerminalPanel.propTypes = {
    distroName: PropTypes.string.isRequired,
  };
  const terminalRef = useRef(null);
  const terminalInstance = useRef(null);
  const fitAddon = useRef(null);
  const [openSessions, setOpenSessions] = useState(new Set());
  const { isTerminalOpen, openTerminal, closeTerminal } = useTerminal();
  const [currentDir, setCurrentDir] = useState("~");
  const [inputBuffer, setInputBuffer] = useState("");

  useEffect(() => {
    if (!terminalInstance.current) {
      terminalInstance.current = new Terminal({
        cursorBlink: true,
        theme: { background: "#1e1e1e", foreground: "#ffffff" },
      });

      fitAddon.current = new FitAddon();
      terminalInstance.current.loadAddon(fitAddon.current);

      if (terminalRef.current) {
        terminalInstance.current.open(terminalRef.current);
        fitAddon.current.fit();

        terminalInstance.current.onData((data) => {
          const terminal = terminalInstance.current;
          if (terminal) {
            const char = data;

            if (char === "\r" || char === "\n") {
              terminal.write("\r\n");
              handleCommand(inputBuffer);
              setInputBuffer("");
              terminal.write(`\r\n${currentDir} $ `);
            } else if (char === "\x7f" || char === "\b") {
              if (inputBuffer.length > 0) {
                terminal.write("\b \b");
              }
            } else {
              terminal.write(char);
              setInputBuffer(prev => prev + char);
            }
          }
        });

        terminalInstance.current.write(`\r\n${currentDir} $ `);
      }
    }
  }, [currentDir, inputBuffer]);

  const handleCommand = (command) => {
    const terminal = terminalInstance.current;
    if (!terminal) return;

    switch (command) {
      case "ls":
        terminal.write("file1.txt\r\nfile2.txt\r\ndirectory/\r\n");
        break;
      case "clear":
        terminal.clear();
        break;
      default:
        if (command.startsWith("cd ")) {
          const newDir = command.split(" ")[1];
          setCurrentDir(newDir);
          terminal.write(`Changed directory to ${newDir}\r\n`);
        } else {
          terminal.write(`Command not found: ${command}\r\n`);
        }
    }
  };

  useEffect(() => {
    if (terminalInstance.current && terminalRef.current && distroName) {
      const terminal = terminalInstance.current;
      terminal.clear();

      if (openSessions.has(distroName)) {
        terminal.write(`\r\nResuming ${distroName} session...\r\n`);
        terminal.write(`$ distrobox enter ${distroName}\r\n`);
        setTimeout(() => {
          terminal.write(`\r\nSession resumed. Welcome back to ${distroName}!\r\n`);
          terminal.write(`\r\n${currentDir} $ `);
        }, 1000);
      } else {
        terminal.write(`\r\nStarting ${distroName} session...\r\n`);
        terminal.write(`$ distrobox create -n ${distroName}\r\n`);
        setTimeout(() => {
          terminal.write(`\r\nContainer created successfully.\r\n`);
          terminal.write(`$ distrobox enter ${distroName}\r\n`);
          setTimeout(() => {
            terminal.write(`\r\nSession started. Welcome to ${distroName}!\r\n`);
            setOpenSessions(prev => new Set(prev).add(distroName));
            terminal.write(`\r\n${currentDir} $ `);
          }, 1000);
        }, 2000);
      }
    }
  }, [distroName, openSessions, currentDir]);

  useEffect(() => {
    if (terminalInstance.current && terminalRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.current?.fit();
      });
      resizeObserver.observe(terminalRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [isTerminalOpen]);

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
          <button   className="text-gray-300 hover:text-white focus:outline-none" size="icon" onClick={toggleTerminal}>
            {isTerminalOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button   className="text-gray-300 hover:text-white focus:outline-none" size="icon">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isTerminalOpen && (
        <div
          className="terminal-container"
          ref={terminalRef}
          style={{ height: "calc(100% - 40px)", width: "100%" }}
        />
      )}
    </div>
  );
}
