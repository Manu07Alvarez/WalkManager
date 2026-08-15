import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppShell } from './app/AppShell';
import { AnimatedAppRoutes } from './app/AnimatedAppRoutes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell>
      <AnimatedAppRoutes />
    </AppShell>
  </React.StrictMode>
);
