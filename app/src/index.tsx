import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App';
import { UserProvider } from './hooks/useUser';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS withCSSVariables
      theme={{
        colorScheme: 'dark',
        colors: {
          dark: [
            "#C1c3C5",
            "#A6a8AB",
            "#909396",
            "#5c6066",
            "#373b40",
            "#13171d",
            "#25272b",
            "#13171d",
            "#141617",
            "#101213",
          ],
        },
      }}
    >
      <UserProvider>
        <App />
      </UserProvider>
    </MantineProvider>
  </React.StrictMode>
);
