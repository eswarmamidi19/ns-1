// getWebcontainerInstance.ts
import { WebContainer } from '@webcontainer/api';

declare global {
  interface Window {
    __webcontainerInstance__: WebContainer | null;
    __bootingPromise__: Promise<WebContainer> | null;
  }
}

if (typeof window !== "undefined") {
  window.__webcontainerInstance__ ||= null;
  window.__bootingPromise__ ||= null;
}

export const getWebcontainerInstance = async (): Promise<WebContainer> => {
  if (typeof window === "undefined") {
    throw new Error("WebContainer can only be booted in the browser");
  }

  if (window.__webcontainerInstance__) {
    return window.__webcontainerInstance__;
  }

  // Prevent race condition with multiple boot calls
  if (!window.__bootingPromise__) {
    window.__bootingPromise__ = WebContainer.boot();
  }

  window.__webcontainerInstance__ = await window.__bootingPromise__;
  return window.__webcontainerInstance__;
};
