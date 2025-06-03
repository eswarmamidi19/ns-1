// useWebContainer.ts
import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { getWebcontainerInstance } from './getWebcontainerInstance';

export const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isInitialized = false;

    const init = async () => {
      try {
        const container = await getWebcontainerInstance();
        if (!isInitialized) setWebContainer(container);
      } catch (err) {
        if (!isInitialized) setError(err as Error);
      }
    };

    init();

    return () => {
      isInitialized = true;
    };
  }, []);

  return { webContainer, error};
};
