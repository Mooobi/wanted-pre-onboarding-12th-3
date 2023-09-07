import { useContext } from 'react';
import { InputContext } from '../context/inputContext';
import { INPUTCONTEXT_ERROR_MESSAGE } from '../constants/constants';

export default function useInput(): { inputValue: string; setInput: (value: string) => void } {
  const contextValue = useContext(InputContext);
  if (contextValue === null) {
    throw new Error(INPUTCONTEXT_ERROR_MESSAGE);
  }
  return contextValue;
}
