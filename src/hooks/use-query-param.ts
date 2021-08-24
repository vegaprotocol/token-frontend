import React from "react";
import { useLocation } from "react-router-dom";

export function useQueryParam<T>(param: string) {
  const location = useLocation();
  return React.useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get(param) as T | "";
  }, [location.search, param]);
}
