import { useState } from 'react';
import { AppContext } from './AppContext';
import { TFinalJson } from '@features/builder/Builder.types';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentRoute, setCurrentRoute] = useState<string>('login');
  const [finalJson, setFinalJson] = useState<TFinalJson[]>([]);


  return <AppContext value={{ currentRoute, setCurrentRoute, finalJson, setFinalJson }}>{children}</AppContext>;
};