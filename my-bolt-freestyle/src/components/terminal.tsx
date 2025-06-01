import { WebContainer } from "@webcontainer/api";
import React, { useEffect, useRef, useState } from "react";

interface TerminalProps {
  webcontainerInstance: WebContainer; // your WebContainer instance
}

export default function Terminal({ webcontainerInstance }: TerminalProps) {
  const [output, setOutput] = useState<string>(""); // terminal output text
  const [inputValue, setInputValue] = useState(""); // current input line
  const shellProcessRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function startShell() {
      if (!webcontainerInstance) return;

      // Spawn jsh shell with terminal size info (optional cols/rows)
      const shellProcess = await webcontainerInstance.spawn("jsh", {
        terminal: {
          cols: 80,
          rows: 24,
        },
      });
      shellProcessRef.current = shellProcess;

      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            setOutput((prev) => prev + data);
          },
        })
      );

      // Focus input on load
      inputRef.current?.focus();
    }

    startShell();


    return () => {
      if (shellProcessRef.current) {
        shellProcessRef.current.kill();
      }
    };
  }, [webcontainerInstance]);

  
  const onInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!shellProcessRef.current) return;

      const input = inputValue + "\n";

      // Write input to shell process stdin
      const writer = shellProcessRef.current.input.getWriter();
      await writer.write(input);
      writer.releaseLock();

      // Clear input field
      setInputValue("");
    }
  };

  // Focus input when clicking on terminal container
  const onContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      onClick={onContainerClick}
      style={{
        backgroundColor: "black",
        color: "white",
        fontFamily: "monospace",
        height: "100%",
        padding: 10,
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        userSelect: "text",
      }}
    >
      {/* Output area */}
      <div>{output}</div>

      {/* Input line */}
      <div style={{ display: "flex" }}>
        <span style={{ marginRight: 4 }}>$</span>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onInputKeyDown}
          style={{
            flex: 1,
            backgroundColor: "black",
            border: "none",
            color: "white",
            fontFamily: "monospace",
            outline: "none",
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}
