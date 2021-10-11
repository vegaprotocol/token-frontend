import React from "react";
import { LocalStorage } from "../lib/storage";

export function useLocalStorage(key: string, initialValue: any) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = React.useState(() => {
    const item = LocalStorage.getItem(key);
    return item ? item : null;
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = (value: any | ((currValue: any) => void)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    LocalStorage.setItem(key, value);
  };

  return [storedValue, setValue];
}
