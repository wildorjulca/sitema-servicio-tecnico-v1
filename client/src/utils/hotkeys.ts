import React, { useEffect } from "react";


export function useBuscarCtrlB(inputRef: React.RefObject<HTMLInputElement>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "g" && e.ctrlKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [inputRef]);
}

export function useEnterKey(callback: () => void, inputRef: React.RefObject<HTMLInputElement>, enabled = true) {
  React.useEffect(() => {
    if (!enabled) return; // si no está activo, no hace nada

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [callback, inputRef, enabled]);
}