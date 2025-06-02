"use"
import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { useWebContainer } from "@/lib/useWebContainer";

interface XtermTerminalProps {
  
  previewRef: React.RefObject<HTMLIFrameElement | null>;
}

export default function XtermTerminal() {
   const {webContainer , error}  = useWebContainer(); // Assuming you have a custom hook to get the WebContainer instance  
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const shellProcessRef = useRef<any>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current || !webContainer) return;

    // Create terminal instance
    const terminal = new Terminal({
      theme: {
        background: "#000000",
        foreground: "#ffffff",
        cursor: "#ffffff",
      },
      fontSize: 14,
      fontFamily: '"Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
      cursorBlink: true,
      convertEol: true,
    });

    // Create addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    // Load addons
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    // Open terminal in the container
    terminal.open(terminalRef.current);
    
    // Fit terminal to container
    fitAddon.fit();

    // Store references
    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    async function startShell() {
      if (!webContainer) return;

      try {
        // Get terminal dimensions
        const { cols, rows } = fitAddon.proposeDimensions() || { cols: 80, rows: 24 };

        // Spawn shell process
        const shellProcess = await webContainer.spawn("jsh", {
          terminal: {
            cols,
            rows,
          },
        });

        shellProcessRef.current = shellProcess;

        // Pipe shell output to terminal
        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              terminal.write(data);
            },
          })
        );

        // Handle terminal input
        terminal.onData((data) => {
          if (shellProcess.input) {
            const writer = shellProcess.input.getWriter();
            writer.write(data).then(() => {
              writer.releaseLock();
            });
          }
        });

        // Handle terminal resize
        terminal.onResize(({ cols, rows }) => {
          shellProcess.resize({ cols, rows });
        });

        // Focus terminal
        terminal.focus();

      } catch (error) {
        console.error("Failed to start shell:", error);
        terminal.write("Failed to start shell\r\n");
      }
    }

    startShell();

    // Handle window resize
    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (shellProcessRef.current) {
        shellProcessRef.current.kill();
      }
      
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, [webContainer]);

  // Handle container resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    });

    if (terminalRef.current) {
      resizeObserver.observe(terminalRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={terminalRef} 
      style={{ 
        width: "100%", 
        height: "100%",
        backgroundColor: "#000000"
      }} 
    />
  );
}