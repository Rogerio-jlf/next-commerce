"use client";

import { ReactNode, useState, useEffect } from "react";

export function Hydrate({ children }: { children: ReactNode }) {
  const [isHydrating, setIsHydrating] = useState(false);

  useEffect(() => {
    setIsHydrating(true);
  }, []);

  return isHydrating ? <>{children}</> : <span>Carregando...</span>;
}
