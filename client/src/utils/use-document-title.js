import { useEffect, useRef } from "react";

export const useDocumentTitle = (title) => {
  const documentDefined = typeof document !== "undefined";
  const originalTitle = useRef(documentDefined ? document.title : null);
  const documentTitle = originalTitle.current;

  useEffect(() => {
    if (!documentDefined) return;

    if (document.title !== title) {
      document.title = title;
    }

    return () => {
      document.title = documentTitle;
    };
  }, [documentDefined, documentTitle, title]);
};
