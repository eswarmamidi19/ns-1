"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";

interface TerminalProps {
  onInput?: (data: string) => void;
  outputData?: string; // optional if you want to push output from outside
}

export default function XTermTerminal({ onInput, outputData }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xterm = useRef<Terminal>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    xterm.current = new Terminal({
      cols: 80,
      rows: 20,
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    });

    xterm.current.open(terminalRef.current);

    if (onInput) {
      xterm.current.onData((data) => {
        onInput(data);
      });
    }

    // Optional: Welcome message
    xterm.current.writeln("Welcome to the terminal!");

    return () => {
      xterm.current?.dispose();
    };
  }, [onInput]);

  // Push external output data to terminal
  useEffect(() => {
    if (outputData && xterm.current) {
      xterm.current.write(outputData);
    }
  }, [outputData]);

  return <div ref={terminalRef} className="bg-black text-white" style={{ width: "100%", height: "300px" }} />;
}
