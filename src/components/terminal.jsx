import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const TerminalComponent = forwardRef((props, ref) => {
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(new FitAddon());
  const resizeObserverRef = useRef(null);
  const termRef = useRef(null);
  const isInitializedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    fitTerminal: () => {
      if (fitAddonRef.current && termRef.current) {
        try {
          fitAddonRef.current.fit();
          invoke("async_resize_pty", {
            rows: termRef.current.rows,
            cols: termRef.current.cols,
          }).catch(error => console.error('Error resizing PTY:', error));
        } catch (error) {
          console.error('Error fitting terminal:', error);
        }
      }
    },
    writeToPty: async (data) => {
      try {
        await invoke("async_write_to_pty", { data });
      } catch (error) {
        console.error("Write error:", error);
      }
    }
  }));

  useEffect(() => {
    if (isInitializedRef.current || !terminalRef.current) return;
    
    const initializeTerminal = async () => {
      termRef.current = new Terminal({
        fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
        fontSize: 14,
        theme: {
          background: "rgb(29,41,61)",
          foreground: "#ffffff",
          cursor: "#ffffff"
        },
        cursorBlink: true,
        convertEol: true,
        scrollback: 1000,
        allowProposedApi: true,
        macOptionIsMeta: true,
        allowTransparency: true,
      });

      const term = termRef.current;
      const fitAddon = fitAddonRef.current;
      let isReading = true;

      term.loadAddon(fitAddon);
      term.open(terminalRef.current);

      resizeObserverRef.current = new ResizeObserver(debounce(() => {
        if (terminalRef.current && term && fitAddon) {
          try {
            fitAddon.fit();
            invoke("async_resize_pty", {
              rows: term.rows,
              cols: term.cols,
            }).catch(console.error);
          } catch (error) {
            console.error('Resize error:', error);
          }
        }
      }, 100));

      resizeObserverRef.current.observe(terminalRef.current);

      const writeBuffer = {
        data: '',
        timeout: null,
        flush() {
          if (this.data) {
            term.write(this.data);
            this.data = '';
          }
          this.timeout = null;
        }
      };

      const writeToPty = async (data) => {
        try {
          if (data.length === 1 || data === '\r' || data === '\n') {
            await invoke("async_write_to_pty", { data: data === '\r' ? '\n' : data });
          } else {
            await invoke("async_write_to_pty", { data });
          }
        } catch (error) {
          console.error("Write error:", error);
        }
      };

      const readFromPty = async () => {
        if (!isReading) return;
        try {
          const data = await invoke("async_read_from_pty");
          if (data) {
            if (data.length < 32) {
              term.write(data.replace(/\n/g, '\r\n'));
            } else {
              writeBuffer.data += data.replace(/\n/g, '\r\n');
              if (!writeBuffer.timeout) {
                writeBuffer.timeout = setTimeout(() => writeBuffer.flush(), 8);
              }
            }
          }
          requestAnimationFrame(readFromPty);
        } catch (error) {
          console.error("Read error:", error);
          if (isReading) {
            requestAnimationFrame(readFromPty);
          }
        }
      };

      term.onData(writeToPty);

      try {
        await invoke("async_create_shell");
        fitAddon.fit();
        await invoke("async_resize_pty", {
          rows: term.rows,
          cols: term.cols,
        });
        readFromPty();
        isInitializedRef.current = true;
      } catch (error) {
        console.error("Initialization error:", error);
      }

      return () => {
        isReading = false;
        clearTimeout(writeBuffer.timeout);
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        term.dispose();
      };
    };

    initializeTerminal();
  }, []);

  return <div ref={terminalRef} className="h-full w-full bg-[rgb(29,41,61)]" />;
});

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

TerminalComponent.displayName = 'TerminalComponent';

TerminalComponent.propTypes = {
  resizeTrigger: PropTypes.number
};

TerminalComponent.defaultProps = {
  resizeTrigger: 0
};

export default TerminalComponent;