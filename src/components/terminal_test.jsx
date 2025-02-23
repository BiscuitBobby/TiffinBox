import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useRef } from "react";

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(new FitAddon());
  const termRef = useRef(
    new Terminal({
      fontFamily: "JetBrains Mono",
      theme: {
        background: "rgb(47, 47, 47)",
      },
    })
  );

  useEffect(() => {
    const term = termRef.current;
    const fitAddon = fitAddonRef.current;

    if (terminalRef.current) {
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);

      const initShell = async () => {
        try {
          await invoke("async_create_shell");
        } catch (error) {
          console.error("Error creating shell:", error);
        }
      };

      const fitTerminal = async () => {
        fitAddon.fit();
        await invoke("async_resize_pty", {
          rows: term.rows,
          cols: term.cols,
        });
      };

      const writeToPty = (data) => {
        invoke("async_write_to_pty", { data });
      };

      const readFromPty = async () => {
        const data = await invoke("async_read_from_pty");
        if (data) {
          term.write(data);
        }
        requestAnimationFrame(readFromPty);
      };

      term.onData(writeToPty);
      window.addEventListener("resize", fitTerminal);

      initShell();
      fitTerminal();
      readFromPty();

      return () => {
        window.removeEventListener("resize", fitTerminal);
        term.dispose();
      };
    }
  }, []);

  return <div ref={terminalRef} className="h-full w-full" />;
};

export default TerminalComponent;