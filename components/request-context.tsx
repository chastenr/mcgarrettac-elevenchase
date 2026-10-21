"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PropertyType, ServiceId } from "@/lib/content";

type Selection = { service?: ServiceId; property?: PropertyType };
type RequestContextValue = {
  selection: Selection;
  select: (service?: ServiceId, property?: PropertyType) => void;
};

const RequestContext = createContext<RequestContextValue | null>(null);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>({});
  const select = (service?: ServiceId, property?: PropertyType) => {
    setSelection((previous) => ({
      ...previous,
      ...(service === undefined ? {} : { service }),
      ...(property === undefined ? {} : { property }),
    }));
  };
  return (
    <RequestContext.Provider value={{ selection, select }}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  const context = useContext(RequestContext);
  if (!context)
    throw new Error("Request components must be inside RequestProvider.");
  return context;
}
