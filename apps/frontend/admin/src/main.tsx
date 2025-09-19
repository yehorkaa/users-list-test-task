import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { AppProvider } from './app/providers/app-provider';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
