"use client";
import { useState, useRef, useEffect, use } from "react";
import { sampleFiles } from "@/lib/sample-data";
import { FileSystemTree, WebContainer } from "@webcontainer/api";
import { File } from "./file-explorer";
import { getWebcontainerInstance } from "@/lib/getWebcontainerInstance";
import { useWebContainer } from "@/lib/useWebContainer";
export function convertToFileSystemTree(files: File[]): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const file of files) {
    if (file.type === 'file') {
      tree[file.name] = {
        file: { contents: file.content! }
      };
    } else if (file.type === 'folder') {
      tree[file.name] = {
        directory: convertToFileSystemTree(file.children!)
      };
    }
  }

  return tree;
}
export default function Preview() {
    const { webContainer, error } = useWebContainer();
  const [status, setStatus] = useState("Waiting...");
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!webContainer) return;

    const run = async () => {
      setStatus("Mounting project files...");
      await webContainer.mount(convertToFileSystemTree(sampleFiles));

      setStatus("Installing dependencies...");
      const install = await webContainer.spawn("npm", ["install"]);
      install.output.pipeTo(
        new WritableStream({
          write: (data) => console.log(data),
        })
      );
      await install.exit;

      setStatus("Starting dev server...");
      const server = await webContainer.spawn("npm", ["run", "dev"]);
      server.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(data);
            if (data.includes("Local")) {
              setStatus("Vite server is running!");
            }
          },
        })
      );

      webContainer.on("server-ready", (port, url) => {
        console.log(`Server ready at: ${url}`);
        if (iframe.current) iframe.current.src = url;
      });
    };

    run();
  }, [webContainer]);

  if (error) return <div>Error: {error.message}</div>;

  return(
     <div className="border rounded-md p-6 w-full h-full flex items-center justify-center">
                 <iframe
        ref={iframe}
        style={{ width: '100%', height: '100%', border: '1px solid #ccc', marginTop: '1rem' }}
      />   
     </div>
  )
}
