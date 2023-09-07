import { ReactNode, createContext, useState } from 'react';

export const InputContext = createContext<{
  inputValue: string;
  setInput: (value: string) => void;
} | null>(null);

export function InputProvider({ children }: { children: ReactNode }) {
  const [inputValue, setInputValue] = useState('');
  console.log(inputValue);
  const setInput = (value: string) => {
    setInputValue(value);
  };

  return <InputContext.Provider value={{ inputValue, setInput }}>{children}</InputContext.Provider>;
}
