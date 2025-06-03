// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { Terminal } from "@xterm/xterm";
// import { FitAddon } from "@xterm/addon-fit";
// import { WebLinksAddon } from "@xterm/addon-web-links";
// import { FileSystemTree } from "@webcontainer/api";
// import "@xterm/xterm/css/xterm.css";
// import { useWebContainer } from "@/lib/useWebContainer";
// import { sampleFiles } from "@/lib/sample-data";
// import { File } from "./file-explorer";

// interface XtermTerminalProps {
//   onServerReady?: (url: string) => void;
//   files?: File[]; 
// }

// let globalSetupComplete = false;
// let globalServerUrl: string | null = null;

// function convertToFileSystemTree(files: File[]): FileSystemTree {
//   const tree: FileSystemTree = {};
//   for (const file of files) {
//     if (file.type === "file") {
//       tree[file.name] = { file: { contents: file.content! } };
//     } else if (file.type === "folder") {
//       tree[file.name] = { directory: convertToFileSystemTree(file.children!) };
//     }
//   }
//   return tree;
// }

// export default function XtermTerminal({ onServerReady ,files }: XtermTerminalProps) {
//   const { webContainer, error } = useWebContainer();
//   const terminalRef = useRef<HTMLDivElement>(null);
//   const xtermRef = useRef<Terminal | null>(null);
//   const shellProcessRef = useRef<any>(null);
//   const fitAddonRef = useRef<FitAddon | null>(null);
//   const [localSetupComplete, setLocalSetupComplete] = useState(globalSetupComplete);
 
//   useEffect(() => {
//     if (!terminalRef.current || !webContainer) return;

//     const terminal = new Terminal({
//       theme: {
//         background: "#000000",
//         foreground: "#ffffff",
//         cursor: "#ffffff",
//       },
//       fontSize: 14,
//       fontFamily: '"Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
//       cursorBlink: true,
//       convertEol: true,
//     });

//     const fitAddon = new FitAddon();
//     const webLinksAddon = new WebLinksAddon();

//     terminal.loadAddon(fitAddon);
//     terminal.loadAddon(webLinksAddon);
//     terminal.open(terminalRef.current);
//     fitAddon.fit();

//     xtermRef.current = terminal;
//     fitAddonRef.current = fitAddon;

//     async function runSetupCommands() {
//       if (!webContainer || globalSetupComplete) {
//         if (globalSetupComplete && globalServerUrl) {
//           terminal.write("✅ Setup already completed!\r\n");
//           terminal.write(`🌐 Server running at: ${globalServerUrl}\r\n`);
//           onServerReady?.(globalServerUrl);
//         }
//         terminal.write("$ ");
//         return;
//       }

//       try {
//         terminal.write("🚀 Mounting project files...\r\n");
//         await webContainer.mount(convertToFileSystemTree(sampleFiles));
//         terminal.write("✅ Project files mounted!\r\n\r\n");

//         terminal.write("📦 Installing dependencies...\r\n");
//         const installProcess = await webContainer.spawn("npm", ["install"]);
//         installProcess.output.pipeTo(
//           new WritableStream({
//             write(data) {
//               terminal.write(data);
//             },
//           })
//         );
//         await installProcess.exit;
//         terminal.write("\r\n✅ Dependencies installed!\r\n\r\n");

//         terminal.write("🔥 Starting dev server...\r\n");
//         const serverProcess = await webContainer.spawn("npm", ["run", "dev"]);

//         serverProcess.output.pipeTo(
//           new WritableStream({
//             write(data) {
//               terminal.write(data);
//               if (data.includes("Local") || data.includes("localhost")) {
//                 terminal.write("\r\n🎉 Server is likely running!\r\n");
//               }
//             },
//           })
//         );

//         webContainer.on("server-ready", (port, url) => {
//           terminal.write(`\r\n🌐 Server ready at: ${url}\r\n`);
//           globalServerUrl = url;
//           onServerReady?.(url);
//         });

//         globalSetupComplete = true;
//         setLocalSetupComplete(true);
//         terminal.write("\r\n💡 Setup complete!\r\n$ ");
//       } catch (err) {
//         console.error("Setup failed:", err);
//         terminal.write(`\r\n❌ Setup failed: ${err}\r\n`);
//       }
//     }

//     async function startShell() {
//       if (!webContainer) {
//         terminal.write("❌ WebContainer not initialized.\r\n");
//         return;
//       }
//       const { cols, rows } = fitAddon.proposeDimensions() || { cols: 80, rows: 24 };
//       const shellProcess = await webContainer.spawn("jsh", { terminal: { cols, rows } });
//       shellProcessRef.current = shellProcess;

//       terminal.onData((data) => {
//         const writer = shellProcess.input.getWriter();
//         writer.write(data).then(() => writer.releaseLock());
//       });

//       terminal.onResize(({ cols, rows }) => shellProcess.resize({ cols, rows }));
//       terminal.focus();

//       await runSetupCommands();

//       shellProcess.output.pipeTo(
//         new WritableStream({
//           write(data) {
//             if (globalSetupComplete) terminal.write(data);
//           },
//         })
//       );
//     }

//     startShell();

//     const resizeHandler = () => fitAddon.fit();
//     window.addEventListener("resize", resizeHandler);

//     return () => {
//       window.removeEventListener("resize", resizeHandler);
//       shellProcessRef.current?.kill();
//       xtermRef.current?.dispose();
//     };
//   }, [webContainer]);

//   useEffect(() => {
//     const observer = new ResizeObserver(() => fitAddonRef.current?.fit());
//     if (terminalRef.current) observer.observe(terminalRef.current);
//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!webContainer || !files) return;
//     // Write changed files to the WebContainer filesystem
  
//     files.forEach(async (file) => {
//       if (file.type === "file") {
//         console.log(`Writing file: ${file.path}`);
//         console.log(`Content: ${file.content}`);
//         await webContainer.fs.writeFile(file.path, file.content ?? "");
//       }
//     });
//     // Optionally, restart the dev server if needed
//   }, [files, webContainer]);

//   if (error) {
//     return <div className="p-4 text-red-500">Error: {error.message}</div>;
//   }

//   return <div ref={terminalRef} style={{ width: "100%", height: "100%", backgroundColor: "#000" }} />;
// }


// Xter.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { FileSystemTree } from "@webcontainer/api";
import "@xterm/xterm/css/xterm.css";
import { useWebContainer } from "@/lib/useWebContainer";
import { sampleFiles } from "@/lib/sample-data";
import { File } from "./file-explorer";

interface XtermTerminalProps {
  onServerReady?: (url: string) => void;
  files?: File[]; 
}

let globalSetupComplete = false;
let globalServerUrl: string | null = null;

function convertToFileSystemTree(files: File[]): FileSystemTree {
  const tree: FileSystemTree = {};
  for (const file of files) {
    if (file.type === "file") {
      tree[file.name] = { file: { contents: file.content! } };
    } else if (file.type === "folder") {
      tree[file.name] = { directory: convertToFileSystemTree(file.children!) };
    }
  }
  return tree;
}

// Helper function to collect all files with their paths
function collectFilesWithPaths(files: File[], basePath = ""): Array<{path: string, content: string}> {
  const result: Array<{path: string, content: string}> = [];
  
  for (const file of files) {
    const currentPath = basePath ? `${basePath}/${file.name}` : file.name;
    
    if (file.type === "file") {
      result.push({
        path: currentPath,
        content: file.content || ""
      });
    } else if (file.type === "folder" && file.children) {
      result.push(...collectFilesWithPaths(file.children, currentPath));
    }
  }
  
  return result;
}

export default function XtermTerminal({ onServerReady, files }: XtermTerminalProps) {
  const { webContainer, error } = useWebContainer();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const shellProcessRef = useRef<any>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [localSetupComplete, setLocalSetupComplete] = useState(globalSetupComplete);
  const [isWritingFiles, setIsWritingFiles] = useState(false);
  const previousFilesRef = useRef<string>("");
 
  useEffect(() => {
    if (!terminalRef.current || !webContainer) return;

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

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    async function runSetupCommands() {
      if (!webContainer || globalSetupComplete) {
        if (globalSetupComplete && globalServerUrl) {
          terminal.write("✅ Setup already completed!\r\n");
          terminal.write(`🌐 Server running at: ${globalServerUrl}\r\n`);
          onServerReady?.(globalServerUrl);
        }
        terminal.write("$ ");
        return;
      }

      try {
        terminal.write("🚀 Mounting project files...\r\n");
        await webContainer.mount(convertToFileSystemTree(sampleFiles));
        terminal.write("✅ Project files mounted!\r\n\r\n");

        terminal.write("📦 Installing dependencies...\r\n");
        const installProcess = await webContainer.spawn("npm", ["install"]);
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              terminal.write(data);
            },
          })
        );
        await installProcess.exit;
        terminal.write("\r\n✅ Dependencies installed!\r\n\r\n");

        terminal.write("🔥 Starting dev server...\r\n");
        const serverProcess = await webContainer.spawn("npm", ["run", "dev"]);

        serverProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              terminal.write(data);
              if (data.includes("Local") || data.includes("localhost")) {
                terminal.write("\r\n🎉 Server is likely running!\r\n");
              }
            },
          })
        );

        webContainer.on("server-ready", (port, url) => {
          terminal.write(`\r\n🌐 Server ready at: ${url}\r\n`);
          globalServerUrl = url;
          onServerReady?.(url);
        });

        globalSetupComplete = true;
        setLocalSetupComplete(true);
        terminal.write("\r\n💡 Setup complete!\r\n$ ");
      } catch (err) {
        console.error("Setup failed:", err);
        terminal.write(`\r\n❌ Setup failed: ${err}\r\n`);
      }
    }

    async function startShell() {
      if (!webContainer) {
        terminal.write("❌ WebContainer not initialized.\r\n");
        return;
      }
      const { cols, rows } = fitAddon.proposeDimensions() || { cols: 80, rows: 24 };
      const shellProcess = await webContainer.spawn("jsh", { terminal: { cols, rows } });
      shellProcessRef.current = shellProcess;

      terminal.onData((data) => {
        const writer = shellProcess.input.getWriter();
        writer.write(data).then(() => writer.releaseLock());
      });

      terminal.onResize(({ cols, rows }) => shellProcess.resize({ cols, rows }));
      terminal.focus();

      await runSetupCommands();

      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            if (globalSetupComplete) terminal.write(data);
          },
        })
      );
    }

    startShell();

    const resizeHandler = () => fitAddon.fit();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      shellProcessRef.current?.kill();
      xtermRef.current?.dispose();
    };
  }, [webContainer]);

  useEffect(() => {
    const observer = new ResizeObserver(() => fitAddonRef.current?.fit());
    if (terminalRef.current) observer.observe(terminalRef.current);
    return () => observer.disconnect();
  }, []);

  // Enhanced file watching and writing effect
  useEffect(() => {
    if (!webContainer || !files || !globalSetupComplete) return;
    
    // Create a hash of current files to detect changes
    const currentFilesHash = JSON.stringify(files.map(f => ({ id: f.id, content: f.content, path: f.path })));
    
    // Skip if files haven't changed
    if (currentFilesHash === previousFilesRef.current || isWritingFiles) {
      return;
    }
    
    previousFilesRef.current = currentFilesHash;
    
    async function writeChangedFiles() {
      if(!webContainer) return
      setIsWritingFiles(true);
      const terminal = xtermRef.current;
      
      try {
        const filesToWrite = collectFilesWithPaths(files!);
        
        for (const file of filesToWrite) {
          try {
            // Ensure directory exists
            const dirPath = file.path.includes('/') ? file.path.substring(0, file.path.lastIndexOf('/')) : '';
            if (dirPath) {
              try {
                await webContainer.fs.mkdir(dirPath, { recursive: true });
              } catch (e) {
                // Directory might already exist, that's okay
              }
            }
            
            // Write the file
            await webContainer.fs.writeFile(file.path, file.content);
            console.log(`✅ Updated file: ${file.path}`);
            
            // Show a subtle notification in terminal
            if (terminal && globalSetupComplete) {
              terminal.write(`\r\n📝 File updated: ${file.path}\r\n$ `);
            }
          } catch (err) {
            console.error(`❌ Failed to write file ${file.path}:`, err);
            if (terminal && globalSetupComplete) {
              terminal.write(`\r\n❌ Failed to update: ${file.path}\r\n$ `);
            }
          }
        }
        
        // Give the dev server a moment to detect changes
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.error("Error writing files:", err);
      } finally {
        setIsWritingFiles(false);
      }
    }
    
    // Debounce file writes to avoid too frequent updates
    const timeoutId = setTimeout(writeChangedFiles, 300);
    
    return () => clearTimeout(timeoutId);
  }, [files, webContainer, isWritingFiles]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return <div ref={terminalRef} style={{ width: "100%", height: "100%", backgroundColor: "#000" }} />;
}