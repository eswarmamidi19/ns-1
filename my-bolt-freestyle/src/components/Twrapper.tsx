'use client';

import dynamic from 'next/dynamic';



const XtermTerminal = dynamic(() => import('./Xter'), {
  ssr: false, // ⛔ disables SSR for this component
});

export default XtermTerminal