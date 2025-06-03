'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Terminal, Loader2 } from 'lucide-react';
import { File } from './file-explorer';

// Terminal Loading Component
const TerminalLoading = () => (
  <div className="w-full h-full bg-black flex items-center justify-center">
    <div className="text-center text-white">
      <div className="flex items-center justify-center mb-4">
        <Terminal className="w-8 h-8 mr-2" />
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm opacity-75">Loading Terminal...</p>
    </div>
  </div>
);

const XtermTerminal = dynamic(() => import('./Xter'), {
  ssr: false,
  loading: () => <TerminalLoading />
});

interface TwrapperProps {
  onServerReady?: (url: string) => void;
  className?: string;
  files : File[];
}

export default function Twrapper({ 
  onServerReady,
  className = "w-full h-full",
  files
}: TwrapperProps) {
  return (
    <div className={className}>
      <Suspense fallback={<TerminalLoading />}>
        <XtermTerminal 
          onServerReady={onServerReady}
          files={files}
        />
      </Suspense>
    </div>
  );
}