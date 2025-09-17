import { MutableRefObject, useRef, useEffect } from "react";
import { isEnvBrowser } from "../utils";
const noop = () => { };

interface NuiMessageData<T = unknown> {
  action: string;
  Data?: T;
}

type NuiHandlerSignature<T> = (data?: T) => void;


export const useNuiEvent = <T = any>(componentName: string, handler: (data?: T) => void) => {

  if (isEnvBrowser()) return;
  const saveHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop);


  useEffect(() => {
    saveHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { action, Data } = event.data;
      if (action === componentName) {
        saveHandler.current(Data);
      }
    }
    window.addEventListener("message", eventListener);
    return () => window.removeEventListener("message", eventListener);
  }, [componentName])

}
