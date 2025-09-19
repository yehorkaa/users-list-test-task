import { BrowserRouter } from 'react-router-dom';
import { TanstackQueryProvider } from './tanstack-query-provider';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <TanstackQueryProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </TanstackQueryProvider>
  );
};
