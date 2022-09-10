import { useEffect, useRef } from "react";

export const useOnClickOut = (handler) => {
  const countRef = useRef(undefined);
  useEffect(() => {
    const _handlCheckOnClick = (event) => {
      if (!countRef.current?.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener("mousedown", _handlCheckOnClick);
    return () => {
      document.removeEventListener("mousedown", _handlCheckOnClick);
    };
  });
  return countRef;
};
