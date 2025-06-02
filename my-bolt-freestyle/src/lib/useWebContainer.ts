// useWebContainer.ts
import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { getWebcontainerInstance } from './getWebcontainerInstance';

export const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const init = async () => {
      try {
        const container = await getWebcontainerInstance();
        if (!isCancelled) setWebContainer(container);
      } catch (err) {
        if (!isCancelled) setError(err as Error);
      }
    };

    init();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { webContainer, error};
};
