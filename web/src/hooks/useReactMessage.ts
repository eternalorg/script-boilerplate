import { useEffect } from "react";
import { isEnvBrowser } from "../utils";


export function useReactMessage<T = any>(componentName: string, handler: (data: T) => void): void {
  if (isEnvBrowser()) {


    useEffect(() => {
      const eventListener = (event: MessageEvent) => {
        const { action } = event.data;
        if (action === componentName) {

          handler(event.data as T);
        }
      }
      window.addEventListener("message", eventListener);
      return () => {
        window.removeEventListener("message", eventListener);
      }

    }, [componentName]);
  }
}
