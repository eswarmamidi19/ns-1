// "use client";

// import { cn } from "@/lib/utils";
// import { ChevronDown, ChevronRight, Copy, Download, ExternalLink, FileIcon, FolderIcon } from "lucide-react";
// import { useState } from "react";
// import { Skeleton } from "./ui/skeleton";
// import { Button } from "./ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
// import { Editor } from "@monaco-editor/react";

// export interface File {
//   id: string;
//   name: string;
//   path: string;
//   type: 'file' | 'folder';
//   content?: string;
//   children?: File[];
//   language?: string;
// }

// export type  FileSelection = File & {
//   isSelected: boolean;
// }

// interface FileExplorerProps {
//   files: File[];
//   isLoading: boolean;
// }

// export default function FileExplorer( { files, isLoading }: FileExplorerProps ) {

//     const [expandedFolders , setExpandedFolders] = useState<Record<string , boolean>>({});
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);

//     const toggleFolder = (folderId : string) =>{
//         setExpandedFolders(prev => ({
//             ...prev,
//             [folderId]: !prev[folderId]
//         }));
//     }

//     const handleFileClick = (file: File) => {

//         if(file.type === "file") {
//             setSelectedFile(file);
//         }

//     };

//      const getLanguageFromFileName = (fileName: string): string => {
//     const extension = fileName.split('.').pop()?.toLowerCase();
//     switch (extension) {
//       case 'js':
//         return 'javascript';
//       case 'ts':
//         return 'typescript';
//       case 'jsx':
//         return 'javascript';
//       case 'tsx':
//         return 'typescript';
//       case 'css':
//         return 'css';
//       case 'json':
//         return 'json';
//       case 'html':
//         return 'html';
//       case 'md':
//         return 'markdown';
//       default:
//         return 'plaintext';
//     }
//   };

//   const renderFileTree = (items: File[], level = 0) => {
//     return items.map((item) => (
//       <div key={item.id} className="select-none">
//         <div
//           className={cn(
//             "flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer text-sm",
//             selectedFile?.id === item.id && "bg-muted",
//           )}
//           style={{ paddingLeft: `${level * 12 + 8}px` }}
//           onClick={() => item.type === 'folder' ? toggleFolder(item.id) : handleFileClick(item)}
//         >
//           {item.type === 'folder' && (
//             expandedFolders[item.id] ?
//               <ChevronDown className="h-4 w-4 mr-1.5 text-muted-foreground" /> :
//               <ChevronRight className="h-4 w-4 mr-1.5 text-muted-foreground" />
//           )}

//           {item.type === 'folder' ? (
//             <FolderIcon className="h-4 w-4 mr-1.5 text-blue-500" />
//           ) : (
//             <FileIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
//           )}

//           <span className="truncate">{item.name}</span>
//         </div>

//         {item.type === 'folder' && expandedFolders[item.id] && item.children && (
//           <div>{renderFileTree(item.children, level + 1)}</div>
//         )}
//       </div>
//     ));
//   };

//   if (isLoading) {
//     return (
//       <div className="border rounded-lg overflow-hidden h-full flex flex-col">
//         <div className="p-4 border-b bg-muted/30">
//           <Skeleton className="h-6 w-64" />
//         </div>
//         <div className="flex flex-1 overflow-hidden">
//           <div className="w-1/3 border-r p-4">
//             <Skeleton className="h-4 w-32 mb-4" />
//             {[1, 2, 3, 4, 5].map((i) => (
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

//     return (
//         <div className="border rounded-lg overflow-hidden h-full flex flex-col">
//       <div className="p-4 border-b bg-muted/30">
//         <h2 className="text-lg font-semibold">File Explorer</h2>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="w-1/3 border-r overflow-auto">
//           <div className="p-4">
//             <h3 className="text-sm font-medium mb-2">Project Files</h3>
//             {renderFileTree(files)}
//           </div>
//         </div>

//         <div className="flex-1 overflow-auto">
//           {selectedFile ? (
//             <div className="h-full flex flex-col">
//               <div className="flex items-center justify-between p-4 border-b">
//                 <div className="font-medium">{selectedFile.path}</div>
//                 <div className="flex items-center space-x-2">
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

// <Tabs defaultValue="code" className="flex-1 flex flex-col">
//   <div className="border-b px-4 bg-gray-800/80">
//     <TabsList className="h-10 flex gap-2 bg-gray-900 rounded-md p-1 w-fit mt-4 mb-2">
//       <TabsTrigger
//         value="code"
//         className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors"
//       >
//         Code
//       </TabsTrigger>
//       <TabsTrigger
//         value="preview"
//         className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors"
//       >
//         Preview
//       </TabsTrigger>
//     </TabsList>
//   </div>
//                 <TabsContent value="code" className="flex-1">
//                    <Editor
//                     height="100%"
//                     defaultLanguage={getLanguageFromFileName(selectedFile.name)}
//                     defaultValue={selectedFile.content || ''}
//                     theme="vs-dark"
//                     options={{
//                       readOnly: true,
//                       minimap: { enabled: false },
//                       fontSize: 14,
//                       lineNumbers: 'on',
//                       scrollBeyondLastLine: false,
//                       automaticLayout: true,
//                     }}
//                   />
//                 </TabsContent>

//                 <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
//                   <div className="border rounded-md p-6 h-full flex items-center justify-center">
//                     <p className="text-muted-foreground">Preview not available</p>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center text-muted-foreground">
//               <p>Select a file to view its contents</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//     );
// }

"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileIcon,
  FolderIcon,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import * as Tabs from "@radix-ui/react-tabs"; 
import { Editor } from "@monaco-editor/react";
import Preview from "./Preview";
import XTermTerminal from "./terminal";

export interface File {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  content?: string;
  children?: File[];
  language?: string;
}

export type FileSelection = File & {
  isSelected: boolean;
};

interface FileExplorerProps {
  files: File[];
  isLoading: boolean;
}

export default function FileExplorer({ files, isLoading }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleFileClick = (file: File) => {
    if (file.type === "file") {
      console.log("Selected file:", file); // Debug log
      setSelectedFile(file);
    }
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "jsx":
        return "javascript";
      case "tsx":
        return "typescript";
      case "css":
        return "css";
      case "json":
        return "json";
      case "html":
        return "html";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  const renderFileTree = (items: File[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} className="select-none">
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer text-sm",
            selectedFile?.id === item.id && "bg-black text-white",
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() =>
            item.type === "folder"
              ? toggleFolder(item.id)
              : handleFileClick(item)
          }
        >
          {item.type === "folder" &&
            (expandedFolders[item.id] ? (
              <ChevronDown className="h-4 w-4 mr-1.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1.5 text-muted-foreground" />
            ))}

          {item.type === "folder" ? (
            <FolderIcon className="h-4 w-4 mr-1.5 text-blue-500" />
          ) : (
            <FileIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
          )}

          <span className="truncate">{item.name}</span>
        </div>

        {item.type === "folder" &&
          expandedFolders[item.id] &&
          item.children && (
            <div>{renderFileTree(item.children, level + 1)}</div>
          )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden h-full flex flex-col">
        <div className="p-4 border-b bg-muted/30">
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r p-4">
            <Skeleton className="h-4 w-32 mb-4" />
            {[1, 2, 3, 4, 5].map((i) => (
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
      <div className="p-4 border-b bg-muted/30">
        <h2 className="text-lg font-semibold">File Explorer</h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r overflow-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Project Files</h3>
            {renderFileTree(files)}
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {selectedFile ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="font-medium">{selectedFile.path}</div>
                <div className="flex items-center space-x-2">
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

              {/* Fix: Use proper Radix Tabs with namespace */}
              <Tabs.Root defaultValue="code" className="flex-1 flex flex-col">
                <div className="border-b px-4 bg-gray-800/80">
                  <Tabs.List className="h-10 flex gap-2 bg-gray-900 rounded-md p-1 w-fit mt-4 mb-2">

                    <Tabs.Trigger
                      value="code"
                      className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors"
                    >
                      Code
                    </Tabs.Trigger>

                    <Tabs.Trigger
                      value="preview"
                      className="px-4 py-1 rounded-md data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors"
                    >
                      Preview
                    </Tabs.Trigger>

                    
                  </Tabs.List>
                </div>

                <Tabs.Content
                  value="code"
                  className="flex-1 data-[state=active]:flex"
                >
                  {/* Debug: Add some logging */}

                  <Editor
                    height="100%"
                    language={getLanguageFromFileName(selectedFile.name)}
                    value={selectedFile.content || "// No content available"}
                    theme="vs-dark"
                    beforeMount={(monaco) => {
                      // Disable semantic validation to remove unreachable code warnings
                      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                        {
                          noSemanticValidation: true,
                          noSuggestionDiagnostics: true,
                        }
                      );
                      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                        {
                          noSemanticValidation: true,
                          noSuggestionDiagnostics: true,
                        }
                      );
                    }}
                    options={{
                      readOnly: false,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      renderValidationDecorations: "off", // This hides the warning decorations
                    }}
                  />
                </Tabs.Content>

                <Tabs.Content
                  value="preview"
                  className="flex-1 p-4 overflow-auto data-[state=active]:flex"
                >
                  <Preview/>
                </Tabs.Content>

        
              </Tabs.Root>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Select a file to view its contents</p>
            </div>
          )}
        </div>

        
      </div>
   
    </div>
  );
}
