"use client";

import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import FileExplorer from "@/components/file-explorer";
import { sampleFiles } from "@/lib/sample-data";
export default function Home() {
  
 const [ isLoading, setIsLoading ] = useState(true);
 const [files , setFiles] = useState(sampleFiles)
 const [steps , setSteps] = useState([])
  

 useEffect(()=>{
    const timer = setTimeout(()=>{
      setIsLoading(false);
    } , 2000);
    return ()=>clearTimeout(timer)
 })

  return (
    <div className="w-full h-screen bg-black text-white">
          <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
            <div className="h-full p-4 overflow-auto">
              {/* <Steps steps={steps} isLoading={isLoading} /> */}  Steps
            </div>
          </ResizablePanel>
           <ResizableHandle/>
          <ResizablePanel defaultSize={70} className="bg-gray-900">
            <div className="h-full p-4 overflow-auto">
                <FileExplorer isLoading={isLoading} files={files}/> 
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}

//  <div className="flex flex-row w-full h-full">
            
//             {/* Steps  */}
//            <div className="w-1/4 h-full bg-gray-800 p-4 overflow-y-auto">
//                steps
//            </div> 
//             {/*  files and text editor  */}
//            <div className="w-3/4 h-full bg-gray-900 p-4 overflow-y-auto">
//                FileEditor
//            </div>

//         </div>