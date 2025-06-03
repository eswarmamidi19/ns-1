
// FileExplorer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileIcon,
  FolderIcon,
  Play,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import * as Tabs from "@radix-ui/react-tabs";
import { Editor } from "@monaco-editor/react";
import Twrapper from "./Twrapper";
import { sampleFiles } from "@/lib/sample-data";

export interface File {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  children?: File[];
  language?: string;
}

interface FileExplorerProps {
  files: File[];
  isLoading: boolean;
}

export default function FileExplorer({ files, isLoading }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("code");
  const [serverStatus, setServerStatus] = useState<"stopped" | "starting" | "running">("stopped");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<File[]>(files);
  //const [selectedFileId, setSelectedFileId] = useState<string | null>(null);


  const previewContainerRef = useRef<HTMLDivElement>(null);

const toggleFullscreen = () => {
  const elem = previewContainerRef.current;
  if (!elem) return;

  if (!document.fullscreenElement) {
    elem.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
};
  
  // Update projectFiles when files prop changes
  useEffect(() => {
    setProjectFiles(files);
  }, [files]);

  // Helper function to update file content recursively
  const updateFileContent = (files: File[], fileId: string, newContent: string): File[] => {
    return files.map(file => {
      if (file.id === fileId) {
        return { ...file, content: newContent };
      }
      if (file.children) {
        return { ...file, children: updateFileContent(file.children, fileId, newContent) };
      }
      return file;
    });
  };

  // Helper function to find file by id recursively
  const findFileById = (files: File[], fileId: string): File | null => {
    for (const file of files) {
      if (file.id === fileId) {
        return file;
      }
      if (file.children) {
        const found = findFileById(file.children, fileId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!selectedFile) return;
    
    const newContent = value || "";
    
    
    // Update the project files state
    setProjectFiles(prevFiles => updateFileContent(prevFiles, selectedFile.id, newContent));
    
    // Update the selected file state
    setSelectedFile(prev => prev ? { ...prev, content: newContent } : null);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const handleFileClick = (file: File) => {
    if (file.type === "file") {
      // Find the most up-to-date version of the file from projectFiles
      const currentFile = findFileById(projectFiles, file.id);
      setSelectedFile(currentFile || file);
    }
  };

  const handleServerReady = (url: string) => {
    setServerStatus("running");  
    console.log("Server is ready at:", url);
    setPreviewUrl(url);
  };

  const handleTerminalTabClick = () => {
    setServerStatus("starting");
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return (
      {
        js: "javascript",
        ts: "typescript",
        jsx: "javascript",
        tsx: "typescript",
        css: "css",
        json: "json",
        html: "html",
        md: "markdown",
      }[ext || ""] || "plaintext"
    );
  };

  const renderFileTree = (items: File[], level = 0) =>
  items.map((item) => (
    <div key={item.id} className="select-none text-sm font-mono">
      <div
        className={cn(
          "flex items-center py-[2px] px-2 rounded-sm  cursor-pointer group",
          selectedFile?.id === item.id && "bg-muted text-foreground"
        )}
        style={{
          paddingLeft: `${level * 16 + 8}px`,
          position: "relative",
        }}
        onClick={() =>
          item.type === "folder"
            ? toggleFolder(item.id)
            : handleFileClick(item)
        }
      >
        {/* Indentation lines like VS Code */}
        <span
          className="absolute left-0 top-0 h-full w-[1px] bg-border"
          style={{ left: `${level * 16 + 4}px` }}
        />

        {/* Folder toggle */}
        {item.type === "folder" ? (
          expandedFolders[item.id] ? (
            <ChevronDown className="h-4 w-4 mr-1.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1.5 text-muted-foreground" />
          )
        ) : (
          <div className="w-4 h-4 mr-1.5" />
        )}

        {/* Icons */}
        {item.type === "folder" ? (
          <FolderIcon className="h-4 w-4 mr-1.5 text-blue-500 group-hover:text-blue-400" />
        ) : (
          <FileIcon className="h-4 w-4 mr-1.5 text-muted-foreground group-hover:text-foreground" />
        )}

        <span className="truncate">{item.name}</span>
      </div>

      {item.type === "folder" &&
        expandedFolders[item.id] &&
        item.children &&
        renderFileTree(item.children, level + 1)}
    </div>
  ));


  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b bg-muted/30">
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r p-4">
            <Skeleton className="h-4 w-32 mb-4" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full mb-2" />
            ))}
          </div>
          <div className="flex-1 p-4">
            <Skeleton className="h-4 w-64 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <h2 className="text-lg font-semibold">File Explorer</h2>
        <div className="flex items-center gap-2 text-sm">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              serverStatus === "stopped" && "bg-gray-400",
              serverStatus === "starting" && "bg-yellow-400 animate-pulse",
              serverStatus === "running" && "bg-green-400"
            )}
          />
          <span className="text-xs text-muted-foreground">
            {serverStatus === "stopped"
              ? "Server Stopped"
              : serverStatus === "starting"
              ? "Starting Server..."
              : "Server Running"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
  <Tabs.Root
    defaultValue="code"
    value={activeTab}
    onValueChange={setActiveTab}
    className="flex-1 flex flex-col"
  >
    <div className="border-b px-4 pt-4">
      <Tabs.List className="h-10 flex gap-2 border rounded-md p-1 w-fit mb-2">
        <Tabs.Trigger
          value="code"
          className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
        >
          <FileIcon className="w-4 h-4" />
          Code
        </Tabs.Trigger>

        <Tabs.Trigger
          value="preview"
          className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Preview
        </Tabs.Trigger>
      </Tabs.List>
    </div>

    {/* Code tab content: file tree + editor */}
    <Tabs.Content
      value="code"
      className="flex-1 flex overflow-hidden data-[state=active]:flex"
    >
      <div className="w-1/3 border-r overflow-auto p-4 bg-surface">
        <h3 className="text-sm font-semibold text-white mb-3 tracking-wide uppercase">
          Project Files
        </h3>
        {renderFileTree(files)}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="font-medium">{selectedFile.path}</div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Editor
              height="75%"
              language={getLanguage(selectedFile.name)}
              value={selectedFile.content || "// No content available"}
              theme="vs-dark"
              beforeMount={(monaco) => {
                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSuggestionDiagnostics: true,
                });
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                  noSemanticValidation: true,
                  noSuggestionDiagnostics: true,
                });
              }}
              onChange={handleEditorChange}
              options={{
                readOnly: false,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                renderValidationDecorations: "off",
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No File Selected</p>
              <p className="text-sm">
                Select a file from the project tree to view its contents
              </p>
            </div>
          </div>
        )}
        <Twrapper
          onServerReady={handleServerReady}
          files={projectFiles}
          className="h-1/4 border-t"
        />
      </div>
    </Tabs.Content>

    {/* Preview Tab */}
    <Tabs.Content
  value="preview"
  className="flex-1 data-[state=active]:flex flex-col w-full"
>
  <div className="flex-1 p-4 w-full">
    <div
      className="w-full h-full border rounded-md overflow-hidden bg-white flex flex-col"
      ref={previewContainerRef}
    >
      {/* Browser Bar */}
      <div className="bg-[#1e1e1e] text-white px-4 py-2 flex items-center justify-between text-sm border-b border-gray-700">
        <div className="flex items-center space-x-2 overflow-hidden">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <div className="ml-4 truncate text-xs bg-[#2d2d2d] px-2 py-1 rounded">
            {previewUrl || "http://localhost"}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-white border border-gray-600 px-2 py-1 hover:bg-gray-700"
          onClick={toggleFullscreen}
        >
          Full Screen
        </Button>
      </div>

      {/* Iframe */}
      <iframe
        src={previewUrl || ""}
        className="w-full flex-1 border-none"
        
        title="Preview"
      />
    </div>
  </div>
</Tabs.Content>
  </Tabs.Root>
</div>

      </div>
    </div>
  );
}





// ITR1

// "use client";

// import { useState, useRef } from "react";
// import { cn } from "@/lib/utils";
// import {
//   ChevronDown,
//   ChevronRight,
//   Copy,
//   Download,
//   ExternalLink,
//   FileIcon,
//   FolderIcon,
//   Play,
// } from "lucide-react";
// import { Skeleton } from "./ui/skeleton";
// import { Button } from "./ui/button";
// import * as Tabs from "@radix-ui/react-tabs";
// import { Editor } from "@monaco-editor/react";
// import Twrapper from "./Twrapper";
// import { sampleFiles } from "@/lib/sample-data";

// export interface File {
//   id: string;
//   name: string;
//   path: string;
//   type: "file" | "folder";
//   content?: string;
//   children?: File[];
//   language?: string;
// }

// interface FileExplorerProps {
//   files: File[];
//   isLoading: boolean;
// }

// export default function FileExplorer({ files, isLoading }: FileExplorerProps) {
//   const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [activeTab, setActiveTab] = useState("code");
//   const [serverStatus, setServerStatus] = useState<"stopped" | "starting" | "running">("stopped");
//   const [previewUrl ,setPreviewUrl]  = useState<string | null>(null);
//   const [fils , setFils] = useState<File[]>(files);
//   const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
//   const handleEditorChange = (value: string | undefined) => {

//     if (!selectedFile)  return;
//     console.log("Editor content changed:", value);
//      setFils((prevFiles) =>
//       prevFiles.map((file) => 
//         file.id === selectedFile.id ? { ...file, content: value || "" } : file
//       )
//     );
//     setSelectedFile((prev) => prev ? { ...prev, content: value || "" } : null);
//   };


//   const toggleFolder = (folderId: string) => {
//     setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
//   };

//   const handleFileClick = (file: File) => {
//     if (file.type === "file") setSelectedFile(file);
//   };

//   const handleServerReady = (url: string) => {
//     setServerStatus("running");  
//     console.log("Server is ready at:", url);
//     // Update the preview iframe when server is ready
//     setPreviewUrl(url);
//   };

//   const handleTerminalTabClick = () => {
//     setServerStatus("starting");
//     // The terminal will handle the actual server startup
//   };

//   const getLanguage = (filename: string): string => {
//     const ext = filename.split(".").pop()?.toLowerCase();
//     return (
//       {
//         js: "javascript",
//         ts: "typescript",
//         jsx: "javascript",
//         tsx: "typescript",
//         css: "css",
//         json: "json",
//         html: "html",
//         md: "markdown",
//       }[ext || ""] || "plaintext"
//     );
//   };

//   const renderFileTree = (items: File[], level = 0) =>
//     items.map((item) => (
//       <div key={item.id} className="select-none">
//         <div
//           className={cn(
//             "flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer text-sm",
//             selectedFile?.id === item.id && "bg-black text-white"
//           )}
//           style={{ paddingLeft: `${level * 12 + 8}px` }}
//           onClick={() =>
//             item.type === "folder" ? toggleFolder(item.id) : handleFileClick(item)
//           }
//         >
//           {item.type === "folder" ? (
//             expandedFolders[item.id] ? (
//               <ChevronDown className="h-4 w-4 mr-1.5 text-muted-foreground" />
//             ) : (
//               <ChevronRight className="h-4 w-4 mr-1.5 text-muted-foreground" />
//             )
//           ) : null}

//           {item.type === "folder" ? (
//             <FolderIcon className="h-4 w-4 mr-1.5 text-blue-500" />
//           ) : (
//             <FileIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
//           )}

//           <span className="truncate">{item.name}</span>
//         </div>
//         {item.type === "folder" && expandedFolders[item.id] && item.children && (
//           <div>{renderFileTree(item.children, level + 1)}</div>
//         )}
//       </div>
//     ));

//   if (isLoading) {
//     return (
//       <div className="border rounded-lg overflow-hidden h-full flex flex-col">
//         <div className="p-4 border-b bg-muted/30">
//           <Skeleton className="h-6 w-64" />
//         </div>
//         <div className="flex flex-1 overflow-hidden">
//           <div className="w-1/3 border-r p-4">
//             <Skeleton className="h-4 w-32 mb-4" />
//             {[...Array(5)].map((_, i) => (
//               <Skeleton key={i} className="h-6 w-full mb-2" />
//             ))}
//           </div>
//           <div className="flex-1 p-4">
//             <Skeleton className="h-4 w-64 mb-4" />
//             <Skeleton className="h-[300px] w-full" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="border rounded-lg overflow-hidden h-full flex flex-col">
//       <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
//         <h2 className="text-lg font-semibold">File Explorer</h2>
//         <div className="flex items-center gap-2 text-sm">
//           <div
//             className={cn(
//               "w-2 h-2 rounded-full",
//               serverStatus === "stopped" && "bg-gray-400",
//               serverStatus === "starting" && "bg-yellow-400 animate-pulse",
//               serverStatus === "running" && "bg-green-400"
//             )}
//           />
//           <span className="text-xs text-muted-foreground">
//             {serverStatus === "stopped"
//               ? "Server Stopped"
//               : serverStatus === "starting"
//               ? "Starting Server..."
//               : "Server Running"}
//           </span>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-1/3 border-r overflow-auto p-4">
//           <h3 className="text-sm font-medium mb-2">Project Files</h3>
//           {renderFileTree(files)}
//         </div>

//         <div className="flex-1 overflow-auto">
//           {selectedFile ? (
//             <div className="h-full flex flex-col">
//               <div className="flex items-center justify-between p-4 border-b">
//                 <div className="font-medium">{selectedFile.path}</div>
//                 <div className="flex space-x-2">
//                   <Button variant="ghost" size="icon">
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <Download className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <ExternalLink className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Tabs.Root
//                 defaultValue="code"
//                 value={activeTab}
//                 onValueChange={setActiveTab}
//                 className="flex-1 flex flex-col"
//               >
//                 <div className="border-b px-4 ">
//                   <Tabs.List className="h-10 flex gap-2  border rounded-md p-1 w-fit mt-2 mb-2">
//                     <Tabs.Trigger
//                       value="code"
//                       className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
//                     >
//                       <FileIcon className="w-4 h-4" />
//                       Code
//                     </Tabs.Trigger>

                  

//                     <Tabs.Trigger
//                       value="preview"
//                       className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
//                     >
//                       <Play className="w-4 h-4" />
//                       Preview
//                       {serverStatus === "stopped" && (
//                         <span className="text-xs opacity-60">(Start server first)</span>
//                       )}
//                     </Tabs.Trigger>
//                   </Tabs.List>
//                 </div>

//                 <Tabs.Content value="code" className="flex-1 data-[state=active]:flex flex-col">
//                   <Editor
//                     height="75%"
//                     language={getLanguage(selectedFile.name)}
//                     value={selectedFile.content || "// No content available"}
//                     theme="vs-dark"
//                     beforeMount={(monaco) => {
//                       monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//                         noSemanticValidation: true,
//                         noSuggestionDiagnostics: true,
//                       });
//                       monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
//                         noSemanticValidation: true,
//                         noSuggestionDiagnostics: true,
//                       });
//                     }}
//                     onChange={handleEditorChange}
//                     options={{
//                       readOnly: false,
//                       minimap: { enabled: false },
//                       fontSize: 14,
//                       lineNumbers: "on",
//                       scrollBeyondLastLine: false,
//                       automaticLayout: true,
//                       renderValidationDecorations: "off",
//                     }}

                    
//                   />

//                    <Twrapper
//                     onServerReady={handleServerReady}
//                     files={fils}
//                     className="h-1/4"
//                   />
//                 </Tabs.Content>

               
//                 <Tabs.Content value="preview" className="flex-1 data-[state=active]:flex flex-col">
                    
//                     <div className="flex-1 p-4">
//                       <div className="w-full h-full border rounded-md overflow-hidden">
//                         <iframe
//                           src={previewUrl || ""}
//                           className="w-full h-full border-none"
//                           title="Preview"
//                         />
//                       </div>
//                     </div>

//                   {/* {serverStatus === "running" ? (
//                     <div className="flex-1 p-4">
//                       <div className="w-full h-full border rounded-md overflow-hidden">
//                         <iframe
//                           src={previewUrl || ""}
//                           className="w-full h-full border-none"
//                           title="Preview"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex-1 flex items-center justify-center text-muted-foreground">
//                       <div className="text-center">
//                         <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                         <p className="text-lg mb-2">Server Not Running</p>
//                         <p className="text-sm">
//                           Go to the Terminal tab to start the development server
//                         </p>
//                         <Button 
//                           variant="outline" 
//                           className="mt-4"
//                           onClick={() => setActiveTab("terminal")}
//                         >
//                           Open Terminal
//                         </Button>
//                       </div>
//                     </div>
//                   )} */}
//                 </Tabs.Content>
//               </Tabs.Root>
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center text-muted-foreground">
//               <div className="text-center">
//                 <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg mb-2">No File Selected</p>
//                 <p className="text-sm">
//                   Select a file from the project tree to view its contents
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// ITR2

// FileExplorer.tsx
// "use client";

// import { useState, useRef, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import {
//   ChevronDown,
//   ChevronRight,
//   Copy,
//   Download,
//   ExternalLink,
//   FileIcon,
//   FolderIcon,
//   Play,
// } from "lucide-react";
// import { Skeleton } from "./ui/skeleton";
// import { Button } from "./ui/button";
// import * as Tabs from "@radix-ui/react-tabs";
// import { Editor } from "@monaco-editor/react";
// import Twrapper from "./Twrapper";
// import { sampleFiles } from "@/lib/sample-data";

// export interface File {
//   id: string;
//   name: string;
//   path: string;
//   type: "file" | "folder";
//   content?: string;
//   children?: File[];
//   language?: string;
// }

// interface FileExplorerProps {
//   files: File[];
//   isLoading: boolean;
// }

// export default function FileExplorer({ files, isLoading }: FileExplorerProps) {
//   const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [activeTab, setActiveTab] = useState("code");
//   const [serverStatus, setServerStatus] = useState<"stopped" | "starting" | "running">("stopped");
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [projectFiles, setProjectFiles] = useState<File[]>(files);
//   const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
//   // Update projectFiles when files prop changes
//   useEffect(() => {
//     setProjectFiles(files);
//   }, [files]);

//   // Helper function to update file content recursively
//   const updateFileContent = (files: File[], fileId: string, newContent: string): File[] => {
//     return files.map(file => {
//       if (file.id === fileId) {
//         return { ...file, content: newContent };
//       }
//       if (file.children) {
//         return { ...file, children: updateFileContent(file.children, fileId, newContent) };
//       }
//       return file;
//     });
//   };

//   // Helper function to find file by id recursively
//   const findFileById = (files: File[], fileId: string): File | null => {
//     for (const file of files) {
//       if (file.id === fileId) {
//         return file;
//       }
//       if (file.children) {
//         const found = findFileById(file.children, fileId);
//         if (found) return found;
//       }
//     }
//     return null;
//   };

//   const handleEditorChange = (value: string | undefined) => {
//     if (!selectedFile) return;
    
//     const newContent = value || "";
    
    
//     // Update the project files state
//     setProjectFiles(prevFiles => updateFileContent(prevFiles, selectedFile.id, newContent));
    
//     // Update the selected file state
//     setSelectedFile(prev => prev ? { ...prev, content: newContent } : null);
//   };

//   const toggleFolder = (folderId: string) => {
//     setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
//   };

//   const handleFileClick = (file: File) => {
//     if (file.type === "file") {
//       // Find the most up-to-date version of the file from projectFiles
//       const currentFile = findFileById(projectFiles, file.id);
//       setSelectedFile(currentFile || file);
//     }
//   };

//   const handleServerReady = (url: string) => {
//     setServerStatus("running");  
//     console.log("Server is ready at:", url);
//     setPreviewUrl(url);
//   };

//   const handleTerminalTabClick = () => {
//     setServerStatus("starting");
//   };

//   const getLanguage = (filename: string): string => {
//     const ext = filename.split(".").pop()?.toLowerCase();
//     return (
//       {
//         js: "javascript",
//         ts: "typescript",
//         jsx: "javascript",
//         tsx: "typescript",
//         css: "css",
//         json: "json",
//         html: "html",
//         md: "markdown",
//       }[ext || ""] || "plaintext"
//     );
//   };

//   const renderFileTree = (items: File[], level = 0) =>
//     items.map((item) => (
//       <div key={item.id} className="select-none">
//         <div
//           className={cn(
//             "flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer text-sm",
//             selectedFile?.id === item.id && "bg-black text-white"
//           )}
//           style={{ paddingLeft: `${level * 12 + 8}px` }}
//           onClick={() =>
//             item.type === "folder" ? toggleFolder(item.id) : handleFileClick(item)
//           }
//         >
//           {item.type === "folder" ? (
//             expandedFolders[item.id] ? (
//               <ChevronDown className="h-4 w-4 mr-1.5 text-muted-foreground" />
//             ) : (
//               <ChevronRight className="h-4 w-4 mr-1.5 text-muted-foreground" />
//             )
//           ) : null}

//           {item.type === "folder" ? (
//             <FolderIcon className="h-4 w-4 mr-1.5 text-blue-500" />
//           ) : (
//             <FileIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
//           )}

//           <span className="truncate">{item.name}</span>
//         </div>
//         {item.type === "folder" && expandedFolders[item.id] && item.children && (
//           <div>{renderFileTree(item.children, level + 1)}</div>
//         )}
//       </div>
//     ));

//   if (isLoading) {
//     return (
//       <div className="border rounded-lg overflow-hidden h-full flex flex-col">
//         <div className="p-4 border-b bg-muted/30">
//           <Skeleton className="h-6 w-64" />
//         </div>
//         <div className="flex flex-1 overflow-hidden">
//           <div className="w-1/3 border-r p-4">
//             <Skeleton className="h-4 w-32 mb-4" />
//             {[...Array(5)].map((_, i) => (
//               <Skeleton key={i} className="h-6 w-full mb-2" />
//             ))}
//           </div>
//           <div className="flex-1 p-4">
//             <Skeleton className="h-4 w-64 mb-4" />
//             <Skeleton className="h-[300px] w-full" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="border rounded-lg overflow-hidden h-full flex flex-col">
//       <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
//         <h2 className="text-lg font-semibold">File Explorer</h2>
//         <div className="flex items-center gap-2 text-sm">
//           <div
//             className={cn(
//               "w-2 h-2 rounded-full",
//               serverStatus === "stopped" && "bg-gray-400",
//               serverStatus === "starting" && "bg-yellow-400 animate-pulse",
//               serverStatus === "running" && "bg-green-400"
//             )}
//           />
//           <span className="text-xs text-muted-foreground">
//             {serverStatus === "stopped"
//               ? "Server Stopped"
//               : serverStatus === "starting"
//               ? "Starting Server..."
//               : "Server Running"}
//           </span>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-1/3 border-r overflow-auto p-4">
//           <h3 className="text-sm font-medium mb-2">Project Files</h3>
//           {renderFileTree(projectFiles)}
//         </div>

//         <div className="flex-1 overflow-auto">
//           {selectedFile ? (
//             <div className="h-full flex flex-col">
//               <div className="flex items-center justify-between p-4 border-b">
//                 <div className="font-medium">{selectedFile.path}</div>
//                 <div className="flex space-x-2">
//                   <Button variant="ghost" size="icon">
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <Download className="h-4 w-4" />
//                   </Button>
//                   <Button variant="ghost" size="icon">
//                     <ExternalLink className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <Tabs.Root
//                 defaultValue="code"
//                 value={activeTab}
//                 onValueChange={setActiveTab}
//                 className="flex-1 flex flex-col"
//               >
//                 <div className="border-b px-4 ">
//                   <Tabs.List className="h-10 flex gap-2  border rounded-md p-1 w-fit mt-2 mb-2">
//                     <Tabs.Trigger
//                       value="code"
//                       className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
//                     >
//                       <FileIcon className="w-4 h-4" />
//                       Code
//                     </Tabs.Trigger>

//                     <Tabs.Trigger
//                       value="preview"
//                       className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
//                     >
//                       <Play className="w-4 h-4" />
//                       Preview
//                       {serverStatus === "stopped" && (
//                         <span className="text-xs opacity-60">(Start server first)</span>
//                       )}
//                     </Tabs.Trigger>
//                   </Tabs.List>
//                 </div>

//                 <Tabs.Content value="code" className="flex-1 data-[state=active]:flex flex-col">
//                   <Editor
//                     height="75%"
//                     language={getLanguage(selectedFile.name)}
//                     value={selectedFile.content || "// No content available"}
//                     theme="vs-dark"
//                     beforeMount={(monaco) => {
//                       monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//                         noSemanticValidation: true,
//                         noSuggestionDiagnostics: true,
//                       });
//                       monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
//                         noSemanticValidation: true,
//                         noSuggestionDiagnostics: true,
//                       });
//                     }}
//                     onChange={handleEditorChange}
//                     options={{
//                       readOnly: false,
//                       minimap: { enabled: false },
//                       fontSize: 14,
//                       lineNumbers: "on",
//                       scrollBeyondLastLine: false,
//                       automaticLayout: true,
//                       renderValidationDecorations: "off",
//                     }}
//                   />

//                   <Twrapper
//                     onServerReady={handleServerReady}
//                     files={projectFiles}
//                     className="h-1/4"
//                   />
//                 </Tabs.Content>

//                 <Tabs.Content value="preview" className="flex-1 data-[state=active]:flex flex-col">
//                   <div className="flex-1 p-4">
//                     <div className="w-full h-full border rounded-md overflow-hidden">
//                       <iframe
//                         src={previewUrl || ""}
//                         className="w-full h-full border-none"
//                         title="Preview"
//                       />
//                     </div>
//                   </div>
//                 </Tabs.Content>
//               </Tabs.Root>
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center text-muted-foreground">
//               <div className="text-center">
//                 <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <p className="text-lg mb-2">No File Selected</p>
//                 <p className="text-sm">
//                   Select a file from the project tree to view its contents
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



